# H5 课件托管系统

基于 Netlify 的轻量级 H5 课件托管系统，支持爱发电订单验证和课程锁定功能。

## 功能特性

- 🔒 自动课程锁定检测
- 💳 爱发电订单验证
- 📱 移动端优化界面
- 💾 本地存储解锁状态
- 🎨 简约美观的 UI 设计

## 项目结构

```
.
├── common/
│   ├── js/
│   │   └── auth.js          # 核心认证逻辑
│   └── css/
│       └── style.css        # 解锁浮层样式
├── netlify/
│   └── functions/
│       └── verify.js        # Netlify 云函数（订单验证）
├── lessons/
│   └── demo-course/
│       └── index.html       # 示例课件
├── netlify.toml             # Netlify 配置
└── package.json
```

## 快速开始

### 1. 部署到 Netlify

1. 将项目推送到 Git 仓库（GitHub/GitLab/Bitbucket）
2. 在 Netlify 中导入项目
3. 配置环境变量 `AFDIAN_TOKEN`（爱发电 API Token）

### 2. 创建课件

在 `lessons/` 目录下创建新的课程文件夹，例如：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>我的课程</title>
  <link rel="stylesheet" href="../../common/css/style.css">
</head>
<body>
  <!-- 课程内容 -->
  
  <script>
    window.COURSE_ID = 'my-course-id';
  </script>
  <script src="../../common/js/auth.js"></script>
</body>
</html>
```

### 3. 配置环境变量

在 Netlify 控制台中设置：

- `AFDIAN_TOKEN`: 爱发电 API Token

## 使用说明

### 设置课程ID

在 HTML 页面中，在引入 `auth.js` 之前设置课程ID：

```javascript
window.COURSE_ID = 'your-course-id';
```

### 解锁状态

- 解锁状态存储在 `localStorage` 中
- 键名格式：`course_unlocked_{COURSE_ID}`
- 解锁后刷新页面不会再次显示浮层

### 监听解锁事件

可以监听 `courseUnlocked` 事件来处理解锁后的逻辑：

```javascript
window.addEventListener('courseUnlocked', function(event) {
  console.log('课程已解锁:', event.detail.courseId);
  // 执行解锁后的操作
});
```

## 爱发电 API 集成

`verify.js` 函数需要根据爱发电的实际 API 文档进行调整：

1. 修改 API 端点 URL
2. 调整请求参数格式
3. 适配响应数据结构
4. 实现订单与课程ID的匹配逻辑

## 本地开发

### 使用 Vite 开发服务器（推荐）

```bash
# 安装依赖
npm install

# 启动 Vite 开发服务器
npm run dev
```

启动后访问：http://localhost:3000

### 测试 Netlify 云函数（可选）

如果需要测试云函数，需要先启动 Netlify Dev：

```bash
# 创建环境变量文件（用于测试云函数）
echo "AFDIAN_TOKEN=your_token_here" > .env

# 在另一个终端启动 Netlify Dev（用于云函数）
npm run netlify:dev
```

然后在 `vite.config.ts` 中取消注释代理配置。

## 测试

查看 [QUICK_START.md](./QUICK_START.md) 快速开始测试，或查看 [TESTING.md](./TESTING.md) 获取详细测试指南。

## 注意事项

1. **安全性**：确保 `AFDIAN_TOKEN` 只存储在环境变量中，不要提交到代码仓库
2. **API 适配**：需要根据爱发电实际 API 文档调整 `verify.js` 中的验证逻辑
3. **课程ID**：确保每个课程使用唯一的 `COURSE_ID`
4. **移动端**：样式已针对移动端优化，适合宝妈群体使用

## 许可证

MIT

