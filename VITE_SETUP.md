# Vite 开发环境设置说明

## 项目已改造为使用 Vite Dev 作为唯一开发服务器

### 主要改动

1. ✅ 根目录添加了 `vite.config.ts` 配置文件
2. ✅ 根目录添加了 `index.html` 作为主页入口
3. ✅ 更新了 `package.json`，添加 Vite 相关依赖
4. ✅ 创建了 `tsconfig.json` 支持 TypeScript

### 启动开发服务器

```bash
# 安装依赖（首次运行）
npm install

# 启动 Vite 开发服务器
npm run dev
```

访问：http://localhost:3000

### 项目结构

```
.
├── index.html              # 主页入口
├── vite.config.ts          # Vite 配置
├── tsconfig.json           # TypeScript 配置
├── package.json            # 项目依赖
├── common/                 # 公共资源
│   ├── css/
│   └── js/
├── lessons/                # 课件目录
│   ├── demo-course/
│   ├── math-addition/
│   ├── ninepluse/          # React + TypeScript 项目
│   └── ...
└── netlify/
    └── functions/          # Netlify 云函数
```

### 访问课件

- 主页：http://localhost:3000
- 示例课程：http://localhost:3000/lessons/demo-course/
- 数学加法：http://localhost:3000/lessons/math-addition/
- 9加几课程：http://localhost:3000/lessons/ninepluse/

### 测试 Netlify 云函数

如果需要测试订单验证功能：

1. 创建 `.env` 文件：
   ```bash
   echo "AFDIAN_TOKEN=your_token_here" > .env
   ```

2. 在另一个终端启动 Netlify Dev：
   ```bash
   npm run netlify:dev
   ```

3. 在 `vite.config.ts` 中取消注释代理配置：
   ```typescript
   proxy: {
     '/.netlify/functions': {
       target: 'http://localhost:8888',
       changeOrigin: true,
     },
   },
   ```

### 构建生产版本

```bash
npm run build
```

构建后的文件在 `dist/` 目录。

### 预览生产构建

```bash
npm run preview
```

### 注意事项

1. **Vite 会自动处理**：
   - TypeScript/TSX 文件转换
   - React 组件
   - 静态 HTML 文件
   - CSS 文件
   - JavaScript 模块

2. **路径引用**：
   - 静态 HTML 课件中的路径（如 `../../common/js/auth.js`）会自动处理
   - React 项目中的导入路径正常工作

3. **热更新**：
   - Vite 支持热模块替换（HMR）
   - 修改文件后自动刷新

4. **Netlify 函数**：
   - 开发时可以通过代理访问（需要启动 Netlify Dev）
   - 生产环境部署到 Netlify 后自动可用


