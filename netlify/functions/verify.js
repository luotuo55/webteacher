/**
 * Netlify 云函数：验证爱发电订单
 * 对接爱发电 API 进行订单验证
 */

const crypto = require('crypto');

/**
 * AES-128-ECB 加密参数
 * @param {Object} params - 业务参数对象
 * @param {string} token - 爱发电 Token（作为密钥）
 * @returns {string} Base64 编码的加密字符串
 */
function encryptParams(params, token) {
  try {
    // 将参数对象序列化为 JSON 字符串
    const jsonString = JSON.stringify(params);
    
    // 确保密钥长度为 16 字节（AES-128）
    const key = Buffer.from(token.substring(0, 16).padEnd(16, '0'), 'utf8');
    
    // 创建加密器（AES-128-ECB 模式）
    const cipher = crypto.createCipheriv('aes-128-ecb', key, null);
    cipher.setAutoPadding(true);
    
    // 加密并转换为 Base64
    let encrypted = cipher.update(jsonString, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    
    return encrypted;
  } catch (error) {
    console.error('加密参数时出错:', error);
    throw error;
  }
}

/**
 * 生成 MD5 签名
 * @param {string} userId - 爱发电 User ID
 * @param {string} params - 加密后的参数
 * @param {number} ts - 时间戳
 * @returns {string} MD5 签名字符串
 */
function generateSign(userId, params, ts) {
  // 按照顺序拼接：user_id + params + ts
  const signString = userId + params + ts;
  
  // 使用 MD5 加密
  return crypto.createHash('md5').update(signString).digest('hex');
}

exports.handler = async function(event, context) {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: JSON.stringify({
        success: false,
        message: 'Method not allowed'
      })
    };
  }

  // 处理 OPTIONS 预检请求
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  try {
    // 解析请求体
    const body = JSON.parse(event.body || '{}');
    const { orderNo, courseId, customOrderId } = body;  // 新增 customOrderId 参数

    // 参数验证
    if (!orderNo || !courseId) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: '缺少必要参数：orderNo 和 courseId'
        })
      };
    }

    // 测试模式：如果订单号以 "test-" 开头，直接通过验证（仅用于开发测试）
    if (orderNo.startsWith('test-')) {
      console.log('测试模式：订单号', orderNo, '课程ID', courseId);
      return {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: true,
          message: '测试模式：验证成功（仅用于开发测试）'
        })
      };
    }

    // 获取爱发电配置（从环境变量）
    const afdianToken = process.env.AFDIAN_TOKEN;
    const afdianUserId = process.env.AFDIAN_USER_ID;
    
    if (!afdianToken || afdianToken === 'your_afdian_token') {
      console.error('AFDIAN_TOKEN 环境变量未设置或未配置');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: '服务器配置错误：请配置 AFDIAN_TOKEN 环境变量'
        })
      };
    }
    
    if (!afdianUserId) {
      console.error('AFDIAN_USER_ID 环境变量未设置');
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
          success: false,
          message: '服务器配置错误：请配置 AFDIAN_USER_ID 环境变量'
        })
      };
    }

    // 调用爱发电 API 验证订单（传入 customOrderId）
    const verifyResult = await verifyAfdianOrder(orderNo, courseId, customOrderId, afdianToken, afdianUserId);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: verifyResult,
        message: verifyResult ? '验证成功' : '验证失败，订单号无效或未购买该课程'
      })
    };

  } catch (error) {
    console.error('验证过程出错:', error);
    console.error('错误堆栈:', error.stack);
    console.error('错误详情:', {
      message: error.message,
      name: error.name,
      orderNo: body?.orderNo,
      courseId: body?.courseId
    });
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: '服务器内部错误',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    };
  }
};

/**
 * 验证爱发电订单
 * @param {string} orderNo - 订单号
 * @param {string} courseId - 课程ID
 * @param {string} customOrderId - 自定义订单号（可选）
 * @param {string} token - 爱发电 Token
 * @param {string} userId - 爱发电 User ID
 * @returns {Promise<boolean>}
 */
async function verifyAfdianOrder(orderNo, courseId, customOrderId, token, userId) {
  try {
    // 爱发电 API 端点
    const apiUrl = 'https://afdian.com/api/open/query-order';
    
    // 1. 构建业务参数
    const params = {
      out_trade_no: orderNo
    };
    
    // 2. 加密参数（AES-128-ECB + Base64）
    const encryptedParams = encryptParams(params, token);
    
    // 3. 生成时间戳（秒级）
    const ts = Math.floor(Date.now() / 1000);
    
    // 4. 生成签名（MD5）
    const sign = generateSign(userId, encryptedParams, ts);
    
    // 5. 构建请求体
    const requestBody = {
      user_id: userId,
      params: encryptedParams,
      ts: ts,
      sign: sign
    };

    // 6. 调用爱发电 API（使用 Promise.race 实现超时控制，兼容性更好）
    const fetchPromise = fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('请求超时（30秒）')), 30000);
    });

    const response = await Promise.race([fetchPromise, timeoutPromise]);

    if (!response.ok) {
      console.error('爱发电 API 请求失败:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('错误详情:', errorText);
      return false;
    }

    const data = await response.json();
    
    // 7. 验证 API 响应
    // 爱发电 API 通常返回格式：{ ecode: 200, data: {...} }
    if (data.ecode === 200 && data.data) {
      const order = data.data;
      
      // 检查订单状态（status === 2 表示支付成功）
      if (order.status !== 2) {
        console.log('订单状态未支付:', order.status);
        return false;
      }

      // 检查自定义订单号是否匹配（如果提供了 customOrderId）
      if (customOrderId && order.custom_order_id) {
        if (order.custom_order_id !== customOrderId) {
          console.log('自定义订单号不匹配:', {
            orderCustomOrderId: order.custom_order_id,
            requestCustomOrderId: customOrderId
          });
          return false;  // 自定义订单号不匹配，拒绝验证
        }
        console.log('自定义订单号匹配成功');
      }

      // 简化逻辑：只要 status === 2 且自定义订单号匹配（如果提供了），就返回成功
      console.log('订单支付成功:', {
        orderNo: orderNo,
        courseId: courseId,
        customOrderId: customOrderId || '未提供',
        status: order.status
      });
      
      return true;
    } else {
      // API 返回错误
      console.error('爱发电 API 返回错误:', data);
      return false;
    }

  } catch (error) {
    // 处理超时或其他网络错误
    if (error.message && error.message.includes('超时')) {
      console.error('爱发电 API 请求超时（30秒）');
    } else {
      console.error('验证订单时出错:', error);
      console.error('错误堆栈:', error.stack);
    }
    return false;
  }
}

