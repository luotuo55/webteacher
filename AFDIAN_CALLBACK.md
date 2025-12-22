# 爱发电支付回调配置指南

## 概述

本系统支持爱发电支付回调（Webhook）功能，当用户完成支付后，爱发电服务器会自动调用我们的回调函数，实现自动解锁课程。

## 回调流程

```
用户完成支付
    ↓
爱发电服务器发送回调通知
    ↓
我们的回调函数接收并验证
    ↓
自动解锁课程（记录日志）
    ↓
用户返回页面时，前端自动检测订单状态
    ↓
课程自动解锁，浮层消失
```

## 配置步骤

### 1. 获取回调 URL

在 Netlify 部署后，你的回调 URL 为：

```
https://你的域名/.netlify/functions/afdian-callback
```

例如：
```
https://your-site.netlify.app/.netlify/functions/afdian-callback
```

### 2. 在爱发电后台配置回调地址

1. 登录[爱发电开发者后台](https://afdian.com/dashboard/dev)
2. 进入应用设置
3. 找到 **Webhook 通知地址** 或 **回调地址** 配置项
4. 填写回调 URL：
   ```
   https://你的域名/.netlify/functions/afdian-callback
   ```
5. 保存配置

### 3. 确保环境变量已配置

在 Netlify 控制台配置以下环境变量：

- `AFDIAN_TOKEN`: 爱发电 Token
- `AFDIAN_USER_ID`: 爱发电 User ID

## 回调数据格式

根据爱发电 API 文档，回调数据格式为：

```json
{
  "ec": 200,           // 错误码，200表示成功
  "em": "",            // 错误消息
  "data": {
    "type": "order",   // 类型，order表示订单
    "order": {
      "out_trade_no": "订单号",
      "user_id": "用户ID",
      "status": 2,     // 状态，2表示支付成功
      "sku_id": "课程ID",  // 或其他字段包含课程ID
      "plan_id": "方案ID",
      "product_id": "商品ID"
    }
  }
}
```

## 回调函数处理逻辑

1. **验证签名**：确保请求来自爱发电（可选，根据实际API文档实现）
2. **检查订单状态**：只处理 `status === 2`（支付成功）的订单
3. **提取课程ID**：从订单数据中提取课程ID（从 `sku_id`、`plan_id`、`product_id` 等字段）
4. **记录日志**：记录订单信息和处理结果
5. **返回响应**：返回 `{ ec: 200, em: '' }` 告知爱发电已成功接收

## 重要说明

### 1. 返回格式

回调函数**必须**返回以下格式，否则爱发电会重复回调：

```json
{
  "ec": 200,
  "em": ""
}
```

### 2. 课程ID映射

确保在爱发电后台创建商品时，商品ID或SKU ID与课程的 `COURSE_ID` 匹配：

- 如果课程ID是 `ninepluse`，商品ID或SKU ID也应该是 `ninepluse`
- 如果课程ID是 `diji`，商品ID或SKU ID也应该是 `diji`

### 3. 前端配合

由于 Netlify Functions 是无状态的，回调函数无法直接修改前端的 `localStorage`。

因此，解锁流程是：
1. 回调函数接收通知并记录日志
2. 用户返回页面时，前端自动检测订单状态
3. 前端验证订单后，自动解锁课程

### 4. 自动检测机制

前端在以下情况会自动检测订单：

1. **URL 参数**：如果 URL 中包含 `?orderNo=订单号`
2. **已保存的订单号**：如果 `localStorage` 中有已验证的订单号
3. **页面焦点**：如果用户从支付页面返回（5分钟内）

## 测试回调功能

### 方法 1：使用真实支付测试

1. 配置回调 URL
2. 完成一次真实支付
3. 查看 Netlify 函数日志，确认收到回调
4. 返回课程页面，应该自动解锁

### 方法 2：查看日志

1. 进入 Netlify 控制台 → Functions → `afdian-callback`
2. 查看实时日志，确认回调是否正常接收

### 方法 3：使用测试工具

可以使用工具（如 Postman）模拟回调请求进行测试：

```bash
POST https://你的域名/.netlify/functions/afdian-callback
Content-Type: application/json

{
  "ec": 200,
  "em": "",
  "data": {
    "type": "order",
    "order": {
      "out_trade_no": "test-order-123",
      "user_id": "test-user",
      "status": 2,
      "sku_id": "ninepluse"
    }
  }
}
```

## 故障排查

### 问题 1：回调未收到

- 检查回调 URL 是否正确配置
- 检查 Netlify 函数是否正常部署
- 查看 Netlify 函数日志

### 问题 2：课程未自动解锁

- 检查课程ID是否匹配（商品ID与COURSE_ID是否一致）
- 检查订单状态是否为 2（支付成功）
- 查看前端控制台是否有错误

### 问题 3：爱发电重复回调

- 确保回调函数返回 `{ ec: 200, em: '' }`
- 确保返回状态码为 200
- 检查函数是否抛出异常

## 安全建议

1. **签名验证**：在生产环境中实现签名验证（根据爱发电API文档）
2. **IP 白名单**：在 Netlify 层面配置 IP 白名单（如果爱发电提供IP列表）
3. **HTTPS**：确保使用 HTTPS（Netlify 默认支持）
4. **日志记录**：记录所有回调请求，便于排查问题

## 相关文件

- `netlify/functions/afdian-callback.js`: 回调处理函数
- `netlify/functions/verify.js`: 订单验证函数
- `common/js/auth.js`: 前端认证逻辑

## 下一步

1. 在爱发电后台配置回调 URL
2. 确保环境变量已配置
3. 测试回调功能
4. 根据实际 API 文档完善签名验证逻辑

