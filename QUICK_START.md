# 快速开始测试

## 5 分钟快速测试

### 步骤 1：安装依赖

```bash
npm install
```

### 步骤 2：启动 Vite 开发服务器

```bash
npm run dev
```

### 步骤 3：访问测试页面

浏览器打开：
- 主页：http://localhost:3000
- 示例课程：http://localhost:3000/lessons/demo-course/
- 数学加法：http://localhost:3000/lessons/math-addition/
- 9加几课程：http://localhost:3000/lessons/ninepluse/

### 步骤 4：测试云函数（可选）

如果需要测试订单验证功能：

```bash
# 创建环境变量文件
echo "AFDIAN_TOKEN=your_token_here" > .env

# 在另一个终端启动 Netlify Dev（用于云函数）
npm run netlify:dev

# 然后在 vite.config.ts 中取消注释代理配置
```

### 步骤 5：测试基本功能

1. **查看锁定状态**
   - 应该看到解锁浮层

2. **测试输入框**
   - 输入任意订单号
   - 点击"验证解锁"

3. **测试静默校验**
   - 打开浏览器开发者工具（F12）
   - 进入 Console，执行：
   ```javascript
   localStorage.setItem('verified_order_no', 'test-order-123');
   localStorage.setItem('course_unlocked_demo-course', 'true');
   ```
   - 刷新页面，应该直接显示内容（不显示浮层）

4. **测试多课程**
   - 访问 http://localhost:8888/lessons/math-addition/
   - 应该自动尝试静默校验

## 测试清单

- [ ] 浮层正常显示
- [ ] 输入框可以输入
- [ ] 按钮可以点击
- [ ] 移动端显示正常（F12 → 设备工具栏）
- [ ] 静默校验功能正常
- [ ] 多个课程可以独立锁定/解锁

## 常见问题

**Q: netlify dev 启动失败？**
- 确保已安装 Netlify CLI：`npm install -g netlify-cli`
- 检查端口 8888 是否被占用

**Q: 云函数返回错误？**
- 检查 `.env` 文件是否存在
- 检查 `AFDIAN_TOKEN` 是否正确设置

**Q: 想测试但不连接真实 API？**
- 可以修改 `netlify/functions/verify.js` 添加测试模式
- 或使用浏览器 Console 手动设置 localStorage

## 详细测试文档

查看 [TESTING.md](./TESTING.md) 获取完整的测试指南。



