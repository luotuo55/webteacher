# 爱发电购买链接配置

## 概述

每个课程可以配置独立的爱发电购买链接。系统支持两种配置方式：

1. **全局默认链接**：在 `auth.js` 中设置默认链接
2. **课程专属链接**：在每个课件页面通过 `window.AFDIAN_URL` 配置

## 配置方式

### 方式 1：课程页面配置（推荐）

在每个课件的 `index.html` 中，在引入 `auth.js` 之前设置：

```html
<script>
  // 设置课程ID
  window.COURSE_ID = 'demo-course';
  
  // 设置该课程的爱发电购买链接
  window.AFDIAN_URL = 'https://afdian.com/p/9c65d9cc617011ed81c352540025c377';
</script>
<script src="../../common/js/auth.js"></script>
```

### 方式 2：全局默认链接

如果某个课程没有配置 `window.AFDIAN_URL`，会使用 `auth.js` 中的默认链接。

## 课程链接配置示例

### 示例课程 1

```html
<!-- lessons/demo-course/index.html -->
<script>
  window.COURSE_ID = 'demo-course';
  window.AFDIAN_URL = 'https://afdian.com/p/9c65d9cc617011ed81c352540025c377';
</script>
```

### 示例课程 2

```html
<!-- lessons/another-course/index.html -->
<script>
  window.COURSE_ID = 'another-course';
  window.AFDIAN_URL = 'https://afdian.com/p/010ff078177211eca44f52540025c377';
</script>
```

## 链接管理建议

### 方案 A：每个课程独立链接

为每个课程创建独立的爱发电商品/方案，每个课程使用自己的链接。

**优点**：
- 可以单独设置价格
- 可以单独统计销量
- 便于管理

**示例**：
- `demo-course` → `https://afdian.com/p/9c65d9cc617011ed81c352540025c377`
- `math-addition` → `https://afdian.com/p/010ff078177211eca44f52540025c377`

### 方案 B：统一链接 + 课程ID匹配

使用一个统一的购买链接，通过订单验证时匹配 `courseId` 来判断用户购买了哪个课程。

**优点**：
- 只需管理一个商品
- 可以设置套餐价格

**缺点**：
- 需要在云函数中精确匹配课程ID

## 当前配置的链接

根据你提供的链接：

1. **链接 1**：`https://afdian.com/p/9c65d9cc617011ed81c352540025c377`
   - 可用于：示例课程、或其他课程

2. **链接 2**：`https://afdian.com/p/010ff078177211eca44f52540025c377`
   - 可用于：其他课程

## 使用建议

1. **为每个课程配置专属链接**（推荐）
   - 在课程页面的 `<script>` 标签中设置 `window.AFDIAN_URL`
   - 这样每个课程都有独立的购买入口

2. **在爱发电后台配置**
   - 为每个课程创建对应的商品/方案
   - 获取对应的购买链接
   - 在课件中配置

3. **测试链接**
   - 确保链接可以正常访问
   - 测试购买流程
   - 验证订单号格式

## 注意事项

1. **链接格式**：确保使用完整的 URL，包括 `https://`
2. **链接有效性**：定期检查链接是否仍然有效
3. **移动端兼容**：链接在移动端也能正常打开
4. **新标签页打开**：链接会在新标签页打开，不影响当前页面

## 快速配置模板

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <!-- ... -->
</head>
<body>
  <!-- 课程内容 -->
  
  <!-- 配置课程ID和爱发电链接 -->
  <script>
    window.COURSE_ID = 'your-course-id';
    window.AFDIAN_URL = 'https://afdian.com/p/your-product-id';
  </script>
  
  <!-- 引入认证脚本 -->
  <script src="../../common/js/auth.js"></script>
</body>
</html>
```

