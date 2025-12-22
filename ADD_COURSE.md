# 添加新课件指南

## 快速步骤

### 1. 创建课件文件夹

在 `lessons/` 目录下创建新文件夹，例如：

```bash
lessons/your-course-name/
```

### 2. 放置课件文件

将你的课件文件放入该文件夹。

## 课件类型

### 类型 A：静态 HTML 课件（类似 demo-course）

如果你的课件是静态 HTML 文件：

**文件结构：**
```
lessons/your-course-name/
  └── index.html
```

**index.html 模板：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>你的课程标题</title>
  
  <!-- 引入认证样式（如果需要认证功能） -->
  <link rel="stylesheet" href="../../common/css/style.css">
  
  <!-- 你的样式 -->
  <style>
    /* 你的 CSS */
  </style>
</head>
<body>
  <!-- 你的课程内容 -->
  
  <!-- 如果需要认证功能，添加以下代码 -->
  <script>
    window.COURSE_ID = 'your-course-name';  // 必须与文件夹名称一致
  </script>
  <script src="../../common/js/auth.js"></script>
  
  <script>
    // 可选：监听解锁事件
    window.addEventListener('courseUnlocked', function(event) {
      console.log('课程已解锁:', event.detail.courseId);
    });
  </script>
</body>
</html>
```

**重要提示：**
- 使用相对路径引用公共资源：`../../common/css/style.css`
- 设置 `window.COURSE_ID` 必须与文件夹名称一致

### 类型 B：React + TypeScript 课件（类似 ninepluse）

如果你的课件是 React + TypeScript 项目：

**文件结构：**
```
lessons/your-course-name/
  ├── index.html
  ├── index.tsx
  ├── App.tsx
  ├── components/
  │   └── ...
  └── ...
```

**index.html 模板：**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>你的课程标题</title>
  <!-- 你的样式和脚本 -->
</head>
<body>
  <div id="root"></div>
  <!-- 使用相对路径！ -->
  <script type="module" src="./index.tsx"></script>
</body>
</html>
```

**重要提示：**
- 使用相对路径 `./index.tsx`，不要使用绝对路径 `/index.tsx`
- 确保所有导入都使用相对路径（如 `./App`, `./components/...`）

### 类型 C：多文件 HTML 课件

如果你的课件有多个 HTML 文件：

**文件结构：**
```
lessons/your-course-name/
  ├── index.html      # 主入口
  ├── page1.html
  ├── page2.html
  ├── css/
  │   └── style.css
  └── js/
      └── script.js
```

**注意：**
- 主入口文件必须是 `index.html`
- 其他文件之间的引用使用相对路径

## 3. 更新 Vite 配置（可选，用于构建）

编辑 `vite.config.ts`，在 `build.rollupOptions.input` 中添加新课件：

```typescript
build: {
  rollupOptions: {
    input: {
      // ... 其他课件
      'your-course-name': resolve(__dirname, 'lessons/your-course-name/index.html'),
    },
  },
},
```

**注意：** 开发模式下不需要这一步，Vite 会自动发现文件。只有构建生产版本时才需要。

## 4. 更新主页导航（可选）

编辑根目录的 `index.html`，在课程网格中添加新课件卡片：

```html
<a href="/lessons/your-course-name/" class="course-card">
  <span class="course-icon">📖</span>
  <h2>你的课程标题</h2>
  <p>课程描述</p>
</a>
```

## 5. 测试

1. 确保 Vite 开发服务器正在运行：`npm run dev`
2. 访问：http://localhost:3000/lessons/your-course-name/
3. 检查浏览器控制台是否有错误

## 常见问题

### Q: 路径引用错误？

**A:** 确保使用相对路径：
- ✅ `../../common/css/style.css`
- ✅ `./index.tsx`
- ❌ `/common/css/style.css`（绝对路径可能有问题）

### Q: TypeScript 文件找不到？

**A:** 确保：
- 使用相对路径 `./index.tsx`
- 文件确实存在于正确的位置
- 刷新浏览器或重启 Vite 服务器

### Q: 样式不生效？

**A:** 检查：
- CSS 文件路径是否正确
- 是否有语法错误
- 浏览器控制台是否有错误

### Q: 认证功能不工作？

**A:** 确保：
- 设置了 `window.COURSE_ID`（与文件夹名称一致）
- 引入了 `auth.js` 脚本
- 引入了 `style.css` 样式

## 示例

### 示例 1：添加一个简单的 HTML 课件

1. 创建文件夹：`lessons/my-course/`
2. 创建 `index.html`：
```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title>我的课程</title>
</head>
<body>
  <h1>欢迎来到我的课程</h1>
</body>
</html>
```
3. 访问：http://localhost:3000/lessons/my-course/

### 示例 2：添加带认证的 HTML 课件

1. 创建文件夹：`lessons/my-course/`
2. 创建 `index.html`（参考上面的模板）
3. 设置 `window.COURSE_ID = 'my-course'`
4. 访问：http://localhost:3000/lessons/my-course/

## 完成！

添加课件后，Vite 会自动检测文件变化，无需重启服务器。


