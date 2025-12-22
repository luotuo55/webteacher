# 爱发电 API 配置指南

## 概述

本系统需要对接爱发电 API 来验证订单。根据[爱发电开发者后台](https://afdian.com/dashboard/dev)的配置，需要完成以下步骤。

## 配置步骤

### 1. 获取 API Token

1. 登录[爱发电开发者后台](https://afdian.com/dashboard/dev)
2. 创建应用或使用现有应用
3. 获取 `API Token`（也称为 `User ID` 和 `Token`）

### 2. 配置环境变量

在 Netlify 控制台中设置环境变量：

1. 进入 Netlify 控制台 → 你的站点 → Site settings → Environment variables
2. 添加环境变量：
   - **变量名**：`AFDIAN_TOKEN`
   - **变量值**：从爱发电开发者后台获取的 Token
   - **变量名**：`AFDIAN_USER_ID`
   - **变量值**：从爱发电开发者后台获取的 User ID

### 3. 本地开发配置

在项目根目录创建 `.env` 文件：

```bash
AFDIAN_TOKEN=your_afdian_token_here
AFDIAN_USER_ID=your_afdian_user_id_here
```

**注意**：`.env` 文件已在 `.gitignore` 中，不会被提交到代码仓库。

## API 使用说明

### 查询订单 API

根据爱发电 API 文档，查询订单的接口为：

**端点**：`https://afdian.net/api/open/query-order`

**请求方式**：POST

**请求参数**：
```json
{
  "user_id": "你的User ID",
  "params": "加密后的参数",
  "ts": "时间戳",
  "sign": "签名"
}
```

**参数加密规则**：
1. 将业务参数 JSON 序列化
2. 使用 AES-128-ECB 加密（密钥为 Token）
3. Base64 编码

**签名规则**：
1. 将 user_id、params、ts 按顺序拼接
2. 使用 MD5 加密
3. 得到 sign

### 当前实现状态

当前 `netlify/functions/verify.js` 已完善加密和签名逻辑：

1. ✅ 测试模式支持（订单号以 `test-` 开头）
2. ✅ AES-128-ECB 加密参数
3. ✅ MD5 签名生成
4. ✅ 完整的订单验证逻辑（状态检查、课程匹配、ALL_ACCESS 支持）
5. ✅ 错误处理和超时处理

## 完善验证逻辑

### 需要实现的功能

根据之前的需求，验证逻辑应该：

1. **订单状态检查**：订单状态为 `confirmed`（已确认）
2. **课程匹配**：订单详情中的 `sku_id` 或 `plan_id` 匹配当前的 `courseId`
3. **特殊逻辑**：如果用户购买了名为 `ALL_ACCESS` 的方案，则无视 `courseId` 直接放行
4. **错误处理**：处理 API 超时或无效订单号的情况

### 示例实现（需要根据实际 API 调整）

```javascript
async function verifyAfdianOrder(orderNo, courseId, token) {
  try {
    // 1. 构建加密参数
    const params = {
      out_trade_no: orderNo
    };
    
    // 2. 加密参数（需要实现 AES-128-ECB 加密）
    const encryptedParams = encryptParams(params, token);
    
    // 3. 生成签名
    const ts = Math.floor(Date.now() / 1000);
    const userId = process.env.AFDIAN_USER_ID; // 需要配置
    const sign = generateSign(userId, encryptedParams, ts, token);
    
    // 4. 调用 API
    const response = await fetch('https://afdian.net/api/open/query-order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id: userId,
        params: encryptedParams,
        ts: ts,
        sign: sign
      })
    });
    
    if (!response.ok) {
      throw new Error('API 请求失败');
    }
    
    const data = await response.json();
    
    // 5. 验证订单
    if (data.ecode === 200 && data.data) {
      const order = data.data;
      
      // 检查订单状态
      if (order.status !== 'confirmed') {
        return false;
      }
      
      // 检查 ALL_ACCESS 方案
      if (order.plan_name === 'ALL_ACCESS') {
        return true;
      }
      
      // 检查课程匹配
      if (order.sku_id === courseId || order.plan_id === courseId) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error('验证订单时出错:', error);
    return false;
  }
}
```

## 测试模式

当前支持测试模式，订单号以 `test-` 开头时会直接通过验证，方便开发测试：

```javascript
if (orderNo.startsWith('test-')) {
  // 测试模式：直接返回成功
  return { success: true };
}
```

## 注意事项

1. **API 密钥安全**：确保 `AFDIAN_TOKEN` 只存储在环境变量中，不要提交到代码仓库
2. **API 限流**：注意爱发电 API 的调用频率限制
3. **错误处理**：妥善处理网络超时、API 错误等情况
4. **日志记录**：在生产环境中记录验证失败的日志，便于排查问题

## 相关链接

- [爱发电开发者后台](https://afdian.com/dashboard/dev)
- [爱发电 API 文档](https://afdian.com/dashboard/dev)（需要在开发者后台查看）

## 下一步

1. 在爱发电开发者后台获取 API Token
2. 配置环境变量 `AFDIAN_TOKEN`
3. 根据实际 API 文档完善 `verify.js` 中的加密和签名逻辑
4. 测试订单验证功能

