/**
 * 测试云函数的脚本
 * 使用方法：node test-verify.js
 * 
 * 注意：需要先启动 netlify dev
 */

const fetch = require('node-fetch'); // 如果 Node.js 版本 < 18，需要安装：npm install node-fetch

const API_URL = 'http://localhost:8888/.netlify/functions/verify';

// 测试用例
const testCases = [
  {
    name: '正常验证',
    data: {
      orderNo: 'test-order-123',
      courseId: 'demo-course'
    }
  },
  {
    name: '缺少订单号',
    data: {
      courseId: 'demo-course'
    }
  },
  {
    name: '缺少课程ID',
    data: {
      orderNo: 'test-order-123'
    }
  },
  {
    name: '空参数',
    data: {}
  }
];

/**
 * 执行测试
 */
async function runTests() {
  console.log('开始测试云函数...\n');
  console.log('API URL:', API_URL);
  console.log('='.repeat(50));

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\n测试 ${i + 1}: ${testCase.name}`);
    console.log('请求数据:', JSON.stringify(testCase.data, null, 2));

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data)
      });

      const data = await response.json();
      console.log('状态码:', response.status);
      console.log('响应数据:', JSON.stringify(data, null, 2));

      if (response.ok) {
        console.log('✅ 测试通过');
      } else {
        console.log('❌ 测试失败');
      }
    } catch (error) {
      console.error('❌ 请求失败:', error.message);
    }

    console.log('-'.repeat(50));
  }

  console.log('\n测试完成！');
}

// 运行测试
runTests().catch(console.error);



