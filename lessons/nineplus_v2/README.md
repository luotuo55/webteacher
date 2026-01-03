# 8、7、6加几 - 互动课件

小学数学一年级上册"8、7、6加几"互动教学课件（人教版2024版第91页）

## 项目结构

```
course-8-7-6-plus/
├── package.json          # 项目配置
├── vite.config.js        # Vite 构建配置
├── index.html            # 入口 HTML
├── public/              # 静态资源目录
│   └── 主题图.png        # 情境导入图片（需要手动复制）
├── src/
│   ├── main.js          # 入口文件
│   ├── App.vue          # 主组件
│   └── components/      # 组件目录
│       ├── SituationIntro.vue    # 情境导入
│       ├── StickAnimation.vue    # 虚拟搬运（小棒图）
│       ├── BranchDiagram.vue     # 分解填充（枝形图）
│       ├── CircleExercise.vue    # 圈一圈练习
│       └── Consolidation.vue     # 巩固练习
└── dist/                # 构建输出目录（构建后生成）
```

## 安装和运行

### 1. 安装依赖

```bash
npm install
```

### 2. 准备静态资源

将图片文件复制到 `public/` 目录：

```bash
# Windows PowerShell
New-Item -ItemType Directory -Force -Path public
Copy-Item "主题图.png" -Destination "public\主题图.png"
```

### 3. 开发调试

```bash
npm run dev
```

在浏览器中打开显示的本地地址（通常是 http://localhost:5173）

### 4. 构建生产版本

```bash
npm run build
```

构建完成后，所有文件会输出到 `dist/` 目录。

## 部署说明

### 部署到网站

1. 构建项目：
   ```bash
   npm run build
   ```

2. 将 `dist/` 文件夹的内容复制到你的网站目录：
   ```
   你的网站/
   └── courses/
       └── course-001/
           ├── index.html
           └── assets/
               ├── index.[hash].js
               └── index.[hash].css
   ```

3. 在网站中添加链接：
   ```html
   <a href="/courses/course-001/index.html" target="_blank">
     8、7、6加几
   </a>
   ```

### 独立运行

构建后的 `dist/index.html` 可以独立运行，直接双击打开或在浏览器中访问即可。

## 功能模块

### 模块1：情境导入
- 展示教材主题图（跑步的学生场景）
- 点击图中人物，显示信息
- 输入算式：8+5

### 模块2：探究新知
1. **虚拟搬运（小棒图）**：点击小棒移动，演示凑十过程
2. **分解填充（枝形图）**：拖拽数字填入枝形图
3. **圈一圈，算一算**：通过圈图练习理解凑十法

### 模块3：巩固练习
- 对比算式，发现算理联系
- 理解凑十法的本质

## 技术特性

- ✅ Vue 3 + Composition API
- ✅ 完全自包含，独立运行
- ✅ Scoped 样式，避免冲突
- ✅ 相对路径，便于部署
- ✅ 响应式设计，适配不同设备
- ✅ 流畅的动画效果
- ✅ 清晰的用户反馈

## 浏览器兼容性

建议使用现代浏览器：
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

## 注意事项

1. **图片资源**：确保 `public/主题图.png` 文件存在
2. **语音功能**：语音提示使用 Web Speech API，需要浏览器支持
3. **构建路径**：已配置相对路径（base: './'），确保可以独立运行

## 升级和替换

- **替换课件**：直接替换 `dist/` 文件夹内容
- **升级课件**：重新构建，覆盖旧文件
- **添加新课件**：创建新的课件项目，使用相同的技术方案


