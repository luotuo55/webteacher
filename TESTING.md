# 测试指南

本文档介绍如何测试 H5 课件托管系统的各项功能。

## 前置准备

### 1. 安装 Netlify CLI

```bash
npm install -g netlify-cli
```

或者使用 npm scripts：

```bash
npm install
```

### 2. 配置环境变量

创建 `.env` 文件（用于本地测试）：

```bash
AFDIAN_TOKEN=your_afdian_token_here
```

**注意**：`.env` 文件已在 `.gitignore` 中，不会被提交到仓库。

## 本地测试

### 方法一：使用 Netlify CLI（推荐）

```bash
# 启动本地开发服务器（会自动加载 .env 文件）
netlify dev
```

启动后，访问：
- 示例课程：http://localhost:8888/lessons/demo-course/
- 数学加法：http://localhost:8888/lessons/math-addition/
- 数学减法：http://localhost:8888/lessons/math-subtraction/
- 英语ABC：http://localhost:8888/lessons/english-abc/
- 逻辑游戏：http://localhost:8888/lessons/logic-game/
- 基础绘画：http://localhost:8888/lessons/drawing-basic/

### 方法二：使用简单的 HTTP 服务器

如果不需要测试云函数，可以使用简单的 HTTP 服务器：

```bash
# 使用 Python（Python 3）
python -m http.server 8000

# 或使用 Node.js 的 http-server
npx http-server -p 8000
```

**注意**：使用简单 HTTP 服务器时，云函数验证功能无法使用，只能测试 UI 界面。

## 测试场景

### 场景 1：测试课程锁定功能

1. **清除浏览器缓存和 localStorage**
   - 打开浏览器开发者工具（F12）
   - 进入 Application/存储 → Local Storage
   - 清除所有 localStorage 数据

2. **访问任意课件**
   - 例如：http://localhost:8888/lessons/demo-course/
   - 应该看到解锁浮层

3. **验证浮层显示**
   - ✅ 遮罩层正常显示
   - ✅ 弹窗内容完整
   - ✅ 输入框可以输入
   - ✅ 按钮可以点击

### 场景 2：测试订单验证（需要配置云函数）

1. **准备测试订单号**
   - 使用真实的爱发电订单号
   - 或修改 `verify.js` 添加测试模式（见下方）

2. **输入订单号并验证**
   - 在解锁浮层中输入订单号
   - 点击"验证解锁"按钮
   - 观察验证过程

3. **验证成功后的行为**
   - ✅ 浮层自动消失
   - ✅ 课程内容正常显示
   - ✅ localStorage 中保存了订单号（`verified_order_no`）
   - ✅ localStorage 中保存了解锁状态（`course_unlocked_{COURSE_ID}`）

### 场景 3：测试静默校验功能

1. **在第一个课件中验证成功**
   - 访问 `demo-course` 并验证订单号
   - 确认已解锁

2. **清除当前课程解锁状态（保留订单号）**
   - 打开开发者工具 → Application → Local Storage
   - 删除 `course_unlocked_demo-course`
   - **保留** `verified_order_no`

3. **访问其他课件**
   - 访问 `math-addition`
   - 应该**不会**显示解锁浮层
   - 课程应该自动解锁（静默校验成功）

4. **验证静默校验失败的情况**
   - 清除所有 localStorage
   - 手动设置一个无效的订单号：`localStorage.setItem('verified_order_no', 'invalid-order')`
   - 访问新课件
   - 应该显示解锁浮层（静默校验失败）

### 场景 4：测试移动端显示

1. **使用浏览器开发者工具**
   - 按 F12 打开开发者工具
   - 点击设备工具栏图标（或按 Ctrl+Shift+M）
   - 选择移动设备（如 iPhone 12）

2. **检查响应式布局**
   - ✅ 浮层在小屏幕上正常显示
   - ✅ 文字大小合适
   - ✅ 按钮大小适合触摸操作
   - ✅ 输入框不会被键盘遮挡

### 场景 5：测试多个课程

1. **依次访问不同课程**
   - 访问 `math-addition` → 验证解锁
   - 访问 `math-subtraction` → 应该自动解锁
   - 访问 `english-abc` → 应该自动解锁
   - 访问 `logic-game` → 应该自动解锁
   - 访问 `drawing-basic` → 应该自动解锁

2. **验证每个课程独立锁定**
   - 清除所有 localStorage
   - 只解锁 `math-addition`
   - 访问 `math-subtraction` → 应该显示浮层（如果订单不匹配该课程）

## 调试技巧

### 1. 查看 Console 日志

打开浏览器开发者工具 → Console，可以看到：
- 验证过程的日志
- 错误信息
- 静默校验的状态

### 2. 检查 localStorage

开发者工具 → Application → Local Storage：
- `verified_order_no`: 已验证的订单号
- `course_unlocked_{COURSE_ID}`: 各课程的解锁状态

### 3. 检查网络请求

开发者工具 → Network：
- 查看 `/api/verify` 请求
- 检查请求参数和响应结果

### 4. 手动测试 localStorage

在浏览器 Console 中执行：

```javascript
// 查看所有 localStorage
console.log(localStorage);

// 手动设置订单号
localStorage.setItem('verified_order_no', 'test-order-123');

// 手动解锁课程
localStorage.setItem('course_unlocked_demo-course', 'true');

// 清除所有数据
localStorage.clear();
```

## 测试云函数（本地）

### 方法一：使用 Netlify Dev

`netlify dev` 会自动启动云函数，可以通过以下方式测试：

```bash
# 使用 curl 测试
curl -X POST http://localhost:8888/.netlify/functions/verify \
  -H "Content-Type: application/json" \
  -d '{"orderNo":"test-order","courseId":"demo-course"}'
```

### 方法二：创建测试脚本

创建 `test-verify.js` 文件进行测试（见下方示例）。

## 常见问题

### Q: 云函数返回 500 错误？

**A**: 检查：
1. `.env` 文件中是否设置了 `AFDIAN_TOKEN`
2. 云函数代码是否有语法错误
3. 查看 Netlify Dev 的控制台输出

### Q: 静默校验不工作？

**A**: 检查：
1. localStorage 中是否有 `verified_order_no`
2. 订单号是否对当前课程有效
3. 浏览器 Console 是否有错误信息

### Q: 浮层不显示？

**A**: 检查：
1. 是否正确引入了 `style.css`
2. 是否设置了 `window.COURSE_ID`
3. 课程是否已经解锁（检查 localStorage）

### Q: 移动端显示异常？

**A**: 检查：
1. 是否正确设置了 viewport meta 标签
2. CSS 媒体查询是否生效
3. 浏览器是否支持 CSS 特性（如 backdrop-filter）

## 生产环境测试

部署到 Netlify 后：

1. **设置环境变量**
   - Netlify 控制台 → Site settings → Environment variables
   - 添加 `AFDIAN_TOKEN`

2. **测试部署的站点**
   - 访问部署后的 URL
   - 按照上述测试场景进行测试

3. **检查云函数日志**
   - Netlify 控制台 → Functions → 查看日志
   - 检查是否有错误信息

## 下一步

- 根据爱发电实际 API 文档调整 `verify.js` 中的验证逻辑
- 添加更多测试用例
- 优化错误处理和用户体验

