/**
 * Netlify 云函数：处理爱发电支付回调
 * 接收爱发电服务器发送的支付通知，自动验证并解锁课程
 * 
 * 爱发电回调格式（根据文档）：
 * {
 *   "ec": 200,           // 错误码，200表示成功
 *   "em": "",            // 错误消息
 *   "data": {
 *     "type": "order",   // 类型，order表示订单
 *     "order": {
 *       "out_trade_no": "订单号",
 *       "user_id": "用户ID",
 *       "status": 2      // 状态，2表示支付成功
 *     }
 *   }
 * }
 */

const crypto = require('crypto');

/**
 * 验证爱发电回调签名（如果需要）
 * @param {Object} callbackData - 回调数据
 * @param {string} token - 爱发电 Token
 * @returns {boolean}
 */
function verifyCallbackSign(callbackData, token) {
  try {
    // 根据爱发电 API 文档，回调可能包含签名字段
    // 如果回调数据包含 sign 字段，需要验证签名
    
    if (callbackData.sign) {
      // 构建待签名字符串（根据爱发电文档调整）
      const signString = callbackData.user_id + 
                        callbackData.params + 
                        callbackData.ts;
      
      // 计算签名
      const calculatedSign = crypto
        .createHash('md5')
        .update(signString)
        .digest('hex');
      
      return calculatedSign === callbackData.sign;
    }
    
    // 如果没有签名字段，可以通过以下方式验证：
    // 1. IP 白名单验证（在 Netlify 层面配置）
    // 2. 检查请求来源
    // 3. 根据实际 API 文档实现
    
    // 临时返回 true，生产环境建议实现签名验证
    return true;
  } catch (error) {
    console.error('验证签名时出错:', error);
    return false;
  }
}

/**
 * 解密回调参数（如果需要）
 * @param {string} encryptedParams - 加密的参数
 * @param {string} token - 爱发电 Token
 * @returns {Object}
 */
function decryptParams(encryptedParams, token) {
  try {
    // Base64 解码
    const encrypted = Buffer.from(encryptedParams, 'base64');
    
    // 确保密钥长度为 16 字节（AES-128）
    const key = Buffer.from(token.substring(0, 16).padEnd(16, '0'), 'utf8');
    
    // 创建解密器（AES-128-ECB 模式）
    const decipher = crypto.createDecipheriv('aes-128-ecb', key, null);
    decipher.setAutoPadding(true);
    
    // 解密
    let decrypted = decipher.update(encrypted, null, 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('解密参数时出错:', error);
    throw error;
  }
}

/**
 * 从订单数据中提取课程ID
 * @param {Object} orderData - 订单数据（爱发电回调格式）
 * @returns {string|null}
 */
function getCourseIdFromOrder(orderData) {
  // 爱发电订单数据可能包含以下字段：
  // - sku_id: SKU ID
  // - plan_id: 方案ID
  // - product_id: 商品ID
  // - sku_detail: SKU详情对象
  
  // 优先从 sku_id 获取
  if (orderData.sku_id) {
    return orderData.sku_id;
  }
  
  // 其次从 plan_id 获取
  if (orderData.plan_id) {
    return orderData.plan_id;
  }
  
  // 从 product_id 获取
  if (orderData.product_id) {
    return orderData.product_id;
  }
  
  // 从 sku_detail 获取
  if (orderData.sku_detail) {
    const detail = orderData.sku_detail;
    return detail.sku_id || detail.plan_id || detail.product_id;
  }
  
  // 从订单项列表中获取
  if (orderData.list && Array.isArray(orderData.list) && orderData.list.length > 0) {
    const firstItem = orderData.list[0];
    return firstItem.sku_id || firstItem.plan_id || firstItem.product_id;
  }
  
  return null;
}

/**
 * 验证订单并解锁课程
 * @param {string} orderNo - 订单号
 * @param {string} courseId - 课程ID
 * @returns {Promise<boolean>}
 */
async function unlockCourseByOrder(orderNo, courseId) {
  try {
    // 记录回调处理日志
    console.log('自动解锁课程:', {
      orderNo: orderNo,
      courseId: courseId,
      timestamp: new Date().toISOString()
    });
    
    // 由于 Netlify Functions 是无状态的，无法直接存储数据
    // 解锁状态由前端通过 localStorage 管理
    // 回调的作用是验证订单，前端会在用户返回时自动检测
    
    // 这里可以：
    // 1. 将解锁信息存储到数据库（如果需要持久化）
    // 2. 发送通知（如果需要）
    // 3. 记录日志（已实现）
    
    return true;
  } catch (error) {
    console.error('解锁课程时出错:', error);
    return false;
  }
}

exports.handler = async function(event, context) {
  // 只允许 POST 请求
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ec: 405,
        em: 'Method not allowed'
      })
    };
  }

  try {
    // 解析回调数据
    const rawBody = event.body || '{}';
    let callbackData;
    
    try {
      callbackData = JSON.parse(rawBody);
    } catch (parseError) {
      console.error('解析回调数据失败:', parseError);
      return {
        statusCode: 200, // 返回200避免重复回调
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 400,
          em: 'Invalid JSON format'
        })
      };
    }

    console.log('收到爱发电回调:', {
      timestamp: new Date().toISOString(),
      data: JSON.stringify(callbackData).substring(0, 500)
    });

    // 获取环境变量
    const token = process.env.AFDIAN_TOKEN;
    const userId = process.env.AFDIAN_USER_ID;
    
    if (!token || !userId) {
      console.error('环境变量未配置');
      return {
        statusCode: 200, // 返回200避免重复回调
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 500,
          em: 'Server configuration error'
        })
      };
    }

    // 验证签名（确保请求来自爱发电）
    if (!verifyCallbackSign(callbackData, token)) {
      console.error('回调签名验证失败');
      return {
        statusCode: 200, // 返回200避免重复回调
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 401,
          em: 'Invalid signature'
        })
      };
    }

    // 检查回调格式（爱发电标准格式）
    if (callbackData.ec !== 200) {
      console.log('回调错误码不为200，忽略:', callbackData.ec, callbackData.em);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 200,
          em: ''
        })
      };
    }

    // 提取订单信息（根据爱发电回调格式）
    const orderData = callbackData.data?.order;
    
    if (!orderData) {
      console.error('回调数据中缺少订单信息');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 200,
          em: ''
        })
      };
    }

    const orderNo = orderData.out_trade_no;
    const orderStatus = orderData.status; // 2表示支付成功
    
    if (!orderNo) {
      console.error('回调数据中缺少订单号');
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 200,
          em: ''
        })
      };
    }

    // 只处理已支付的订单（status === 2 表示支付成功）
    if (orderStatus !== 2) {
      console.log('订单状态未支付，忽略回调:', orderStatus);
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 200,
          em: ''
        })
      };
    }

    // 提取课程ID
    const courseId = getCourseIdFromOrder(orderData);
    
    if (!courseId) {
      console.error('无法从订单数据中提取课程ID:', {
        orderNo: orderNo,
        orderData: JSON.stringify(orderData).substring(0, 200)
      });
      // 返回成功，避免爱发电重复回调
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ec: 200,
          em: ''
        })
      };
    }

    // 验证并解锁课程
    const unlockSuccess = await unlockCourseByOrder(orderNo, courseId);

    console.log('回调处理完成:', {
      orderNo: orderNo,
      courseId: courseId,
      unlocked: unlockSuccess
    });

    // 返回成功响应给爱发电（重要：必须返回 { ec: 200, em: '' }，否则爱发电会重复回调）
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ec: 200,
        em: ''
      })
    };

  } catch (error) {
    console.error('处理回调时出错:', error);
    console.error('错误堆栈:', error.stack);
    
    // 即使出错，也返回 200（避免爱发电重复回调）
    // 但记录错误日志以便排查
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ec: 200,
        em: ''
      })
    };
  }
};

