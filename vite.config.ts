import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react({
      // 只对 .tsx 和 .jsx 文件使用 React 插件
      include: /\.(tsx|jsx)$/,
    }),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    // 代理 Netlify 函数（可选：如果需要测试云函数，需要先启动 netlify dev）
    // proxy: {
    //   '/.netlify/functions': {
    //     target: 'http://localhost:8888',
    //     changeOrigin: true,
    //   },
    // },
  },
  // 配置公共基础路径
  base: '/',
  // 构建配置
  build: {
    outDir: 'dist',
    rollupOptions: {
      // 多页面入口配置
      input: {
        main: resolve(__dirname, 'index.html'),
        'ninepluse': resolve(__dirname, 'lessons/ninepluse/index.html'),
        'diji': resolve(__dirname, 'lessons/diji/index.html'),
      },
    },
  },
  // 解析配置
  resolve: {
    alias: {
      '@': resolve(__dirname, '.'),
      '@common': resolve(__dirname, 'common'),
      '@lessons': resolve(__dirname, 'lessons'),
    },
  },
  // 优化依赖
  optimizeDeps: {
    include: ['react', 'react-dom', 'lucide-react', 'framer-motion'],
  },
});

