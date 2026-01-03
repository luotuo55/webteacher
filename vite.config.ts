import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    vue(),
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  // 配置公共基础路径
  base: '/',
  // 构建配置
  build: {
    outDir: 'dist',
    rollupOptions: {
      // 多页面入口配置 (按年级系统重组 + 法律/信息页面)
      input: {
        main: resolve(__dirname, 'index.html'),
        'about': resolve(__dirname, 'about.html'),
        'contact': resolve(__dirname, 'contact.html'),
        'privacy': resolve(__dirname, 'privacy.html'),
        'disclaimer': resolve(__dirname, 'disclaimer.html'),
        'lessons/grade-1/making-ten-9': resolve(__dirname, 'lessons/grade-1/making-ten-9/index.html'),
        'lessons/grade-1/adding-876': resolve(__dirname, 'lessons/grade-1/adding-876/index.html'),
        'lessons/grade-1/make-ten-assistant': resolve(__dirname, 'lessons/grade-1/make-ten-assistant/index.html'),
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
    include: ['react', 'react-dom', 'lucide-react', 'framer-motion', 'vue'],
  },
  // 配置 public 目录
  publicDir: 'public',
});
