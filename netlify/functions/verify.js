/**
 * Netlify 云函数：验证爱发电订单
 * 对接爱发电 API 进行订单验证
 */

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
    const { orderNo, courseId } = body;

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

    // 获取爱发电 Token（从环境变量）
    const afdianToken = process.env.AFDIAN_TOKEN;
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

    // 调用爱发电 API 验证订单
    const verifyResult = await verifyAfdianOrder(orderNo, courseId, afdianToken);

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
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: '服务器内部错误'
      })
    };
  }
};

/**
 * 验证爱发电订单
 * @param {string} orderNo - 订单号
 * @param {string} courseId - 课程ID
 * @param {string} token - 爱发电 Token
 * @returns {Promise<boolean>}
 */
async function verifyAfdianOrder(orderNo, courseId, token) {
  try {
    // 爱发电 API 端点
    // 注意：这里需要根据爱发电实际 API 文档调整
    const apiUrl = 'https://afdian.net/api/open/query-order';
    
    // 构建请求参数
    const requestBody = {
      out_trade_no: orderNo,
      // 可以根据需要添加其他参数，如商品ID等
    };

    // 调用爱发电 API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        // 根据爱发电 API 文档调整认证方式
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.error('爱发电 API 请求失败:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    
    // 根据爱发电 API 返回的数据结构进行验证
    // 这里需要根据实际 API 响应格式调整
    // 示例逻辑：
    // 1. 检查订单是否存在
    // 2. 检查订单状态是否为已支付
    // 3. 检查订单是否包含该课程ID
    
    // 假设返回格式为：{ code: 200, data: { status: 'paid', items: [...] } }
    if (data.code === 200 && data.data) {
      const order = data.data;
      
      // 检查订单状态
      if (order.status !== 'paid') {
        return false;
      }

      // 检查订单是否包含该课程
      // 这里可以根据实际业务逻辑调整
      // 例如：检查订单中的商品ID是否匹配 courseId
      if (order.items && Array.isArray(order.items)) {
        const hasCourse = order.items.some(item => {
          // 根据实际数据结构调整匹配逻辑
          return item.product_id === courseId || 
                 item.sku_id === courseId ||
                 item.name && item.name.includes(courseId);
        });
        return hasCourse;
      }

      // 如果没有 items 字段，可以根据其他字段判断
      // 或者简化逻辑：只要订单已支付就通过（不推荐，安全性较低）
      return true;
    }

    return false;

  } catch (error) {
    console.error('验证订单时出错:', error);
    return false;
  }
}

