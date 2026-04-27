# 社交急救包 - 设计指南

## 品牌定位
- **应用类型**：社交技能训练 / 知识问答类小程序
- **设计风格**：温暖亲和、轻松活泼、鼓励式学习
- **目标用户**：社交焦虑人群、内向者、希望提升社交技能的年轻人

## 配色方案

### 主色板
- **主色**：`#FF6B6B`（温暖珊瑚红）→ Tailwind: 自定义 `bg-primary` / `text-primary`
- **渐变主色**：`#FF6B6B → #FF8E53`（珊瑚红到暖橙）
- **紫色点缀**：`#667eea → #764ba2`（解锁 Banner）

### 语义色
- **成功/正确**：`#34C759` → `bg-green-500` / `text-green-500`
- **错误/错误**：`#FF3B30` → `bg-red-500` / `text-red-500`
- **提示/解析**：`#F57C00` → `text-orange-600`
- **信息标签**：`#FFF0F0` 背景 + `#FF6B6B` 文字

### 中性色
- **主文字**：`#1a1a1a` → `text-gray-900`
- **次要文字**：`#8e8e93` → `text-gray-500`
- **分割线/边框**：`#e5e5ea` / `#f0f0f0`
- **背景**：`#f5f5f7` / `#fff`

## 组件使用原则
- 通用 UI 组件（按钮、卡片、弹窗、标签、Toast 等）优先使用 `@/components/ui/*`
- 页面结构容器和特殊布局使用 `@tarojs/components` 的 View/Text
- 按钮：使用 `Button` 组件，渐变按钮通过 className 自定义
- 卡片容器：使用 `Card` 组件
- 标签：使用 `Badge` 组件
- 弹窗：使用 `Dialog` 组件
- Toast 提示：使用 `Sonner` 组件
- 进度条：使用 `Progress` 组件

## 间距系统
- **页面水平边距**：`px-5`（20px）
- **卡片内边距**：`p-4` 或 `p-5`（16-20px）
- **卡片圆角**：`rounded-2xl`（16px）或 `rounded-xl`（12px）
- **组件间距**：`gap-3`（12px）
- **区块间距**：`mb-4` 或 `gap-4`（16px）

## 导航结构
- **TabBar**：2 个标签页
  - 首页（House 图标）- 场景筛选 + 内嵌答题流
  - 我的（User 图标）- 练习数据 + 收藏 + 升级
- **TabBar 配色**：未选中 `#8e8e93`，选中 `#FF6B6B`

## 页面路由
- `/pages/index/index` - 首页
- `/pages/category/index` - 分类
- `/pages/quiz-list/index` - 题库
- `/pages/profile/index` - 我的
- `/pages/quiz/index` - 答题页（navigateTo）
- `/pages/result/index` - 结果页（navigateTo）
- `/pages/category-detail/index` - 分类详情（navigateTo）

## 小程序约束
- 图片资源使用 TOS 对象存储
- TabBar 图标使用本地 PNG
- 避免硬编码 px，使用 Tailwind 预设类名
- 跨端兼容：Text 换行加 block、Input 用 View 包裹
