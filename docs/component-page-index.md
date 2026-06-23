# Component Page Index

This document is the working index for component page organization in the AgentOS Figma file.

It defines:

- the parent category order
- the target component classification under each DNA branch
- which component pages already exist and must keep their current Figma page names
- which component pages are still missing and should be created as `Todo`

## Naming Rules

### Parent category pages

Use this exact format:

- `1. Control DNA(交互控件)`
- `2. Overlay DNA(浮层)`
- `3. Selection DNA(选择)`
- `4. Navigation DNA(导航)`
- `5. Feedback DNA(反馈)`
- `6. Information DNA(信息展示)`
- `7. Layout DNA(布局容器)`
- `8. Visualization DNA(可视化)`

### Missing component pages

Create missing pages with this exact format:

- `├─  {EN Name} CN Name (Todo)`

### Existing component pages

- Do not rename existing pages.
- Reorder them under the parent category only.
- If the repo does not currently record the exact Figma page name, treat the current Figma page name as the source of truth and keep it unchanged.

## Source Of Truth

Classification source:

- [`tokens/components/_dna-tree.json`](../tokens/components/_dna-tree.json)

Existing implemented component evidence:

- component specs in [`tokens/components/`](../tokens/components/)

## Page Index

### 1. Control DNA(交互控件)

Existing:

- `Button` — existing page in Figma; keep current page name as-is
- `Input` — existing page in Figma; keep current page name as-is
- `Checkbox` — existing page in Figma; keep current page name as-is
- `Radio` — existing page in Figma; keep current page name as-is

Missing:

- `├─  Icon Button 图标按钮 (Todo)`
- `├─  Textarea 文本域 (Todo)`
- `├─  Select 选择器 (Todo)`
- `├─  Combobox 组合框 (Todo)`
- `├─  Autocomplete 自动完成 (Todo)`
- `├─  Date Picker 日期选择器 (Todo)`
- `├─  Time Picker 时间选择器 (Todo)`
- `├─  Number Input 数字输入框 (Todo)`
- `├─  Search 搜索框 (Todo)`
- `├─  Switch 开关 (Todo)`
- `├─  Radio Group 单选组 (Todo)`
- `├─  Segmented Control 分段控制器 (Todo)`
- `├─  Toggle 切换按钮 (Todo)`
- `├─  Slider 滑块 (Todo)`
- `├─  Stepper 步进器 (Todo)`
- `├─  File Upload 文件上传 (Todo)`

### 2. Overlay DNA(浮层)

Existing:

- `├─  Popover 气泡卡片   ✅ ✨`
- `├─  Dropdown 下拉菜单  ✅✨`
- `├─  Tooltip 文字提示✅ ✨`

Missing:

- `├─  Hover Card 悬浮信息卡 (Todo)`
- `├─  Context Menu 右键菜单 (Todo)`
- `├─  Dialog 对话框 (Todo)`
- `├─  Alert Dialog 警告对话框 (Todo)`
- `├─  Drawer 抽屉 (Todo)`
- `├─  Sheet 面板层 (Todo)`
- `├─  Side Panel 侧边面板 (Todo)`
- `├─  Bottom Sheet 底部面板 (Todo)`
- `├─  Command Palette 命令面板 (Todo)`
- `├─  Coachmark 引导气泡 (Todo)`

### 3. Selection DNA(选择)

Existing:

- none

Missing:

- `├─  Listbox 列表选择框 (Todo)`
- `├─  Transfer 穿梭框 (Todo)`
- `├─  Tree Select 树选择器 (Todo)`
- `├─  Picker Panel 选择面板 (Todo)`
- `├─  Table Row Selection 表格行选择 (Todo)`

### 4. Navigation DNA(导航)

Existing:

- `├─  Breadcrumb 面包屑  ✅✨`
- `├─  Pagination 分页  ✅✨`
- `├─  Anchor 锚点   ✅✨`

Missing:

- `├─  Navbar 顶部导航栏 (Todo)`
- `├─  Sidebar 侧边导航栏 (Todo)`
- `├─  Navigation Menu 导航菜单 (Todo)`
- `├─  Tabs 标签页 (Todo)`
- `├─  Steps 步骤条 (Todo)`
- `├─  Menu 菜单 (Todo)`
- `├─  Back-to-top 回到顶部 (Todo)`

### 5. Feedback DNA(反馈)

Existing:

- `Skeleton` — existing page in Figma; keep current page name as-is

Missing:

- `├─  Toast 轻提示 (Todo)`
- `├─  Alert 警告提示 (Todo)`
- `├─  Banner 横幅通知 (Todo)`
- `├─  Inline Message 行内提示 (Todo)`
- `├─  Snackbar 底部提示条 (Todo)`
- `├─  Empty State 空状态 (Todo)`
- `├─  Progress 进度条 (Todo)`
- `├─  Spinner 加载器 (Todo)`
- `├─  Result 结果页 (Todo)`
- `├─  Status Badge 状态徽标 (Todo)`

### 6. Information DNA(信息展示)

Existing:

- `├─  Badge 徽标 ✨`
- `├─  Tag 标签`

Missing:

- `├─  Avatar 头像 (Todo)`
- `├─  Chip 标签块 (Todo)`
- `├─  Stat 统计数值 (Todo)`
- `├─  Description List 描述列表 (Todo)`
- `├─  Card 卡片 (Todo)`
- `├─  List Item 列表项 (Todo)`
- `├─  Timeline 时间轴 (Todo)`

### 7. Layout DNA(布局容器)

Existing:

- none

Missing:

- `├─  Container 容器 (Todo)`
- `├─  Stack 堆叠布局 (Todo)`
- `├─  Grid 网格 (Todo)`
- `├─  Flex 弹性布局 (Todo)`
- `├─  Split View 分栏视图 (Todo)`
- `├─  Divider 分割线 (Todo)`
- `├─  Separator 分隔符 (Todo)`
- `├─  Panel 面板 (Todo)`
- `├─  Section 区块 (Todo)`
- `├─  Dashboard Layout 仪表盘布局 (Todo)`

### 8. Visualization DNA(可视化)

Existing:

- none

Missing:

- `├─  Line Chart 折线图 (Todo)`
- `├─  Bar Chart 柱状图 (Todo)`
- `├─  Pie Chart 饼图 (Todo)`
- `├─  Area Chart 面积图 (Todo)`
- `├─  Scatter Plot 散点图 (Todo)`
- `├─  Heatmap 热力图 (Todo)`
- `├─  Treemap 矩形树图 (Todo)`
- `├─  Gauge 仪表盘 (Todo)`
- `├─  Map 地图 (Todo)`
- `├─  Sankey 桑基图 (Todo)`
- `├─  Network Graph 网络图 (Todo)`
- `├─  3D Viewer 3D 查看器 (Todo)`

## Notes

- `Dropdown` is currently grouped under Overlay DNA for page organization.
- `Radio` is currently treated as the existing base page under Control DNA, while `Radio Group` remains a separate Todo page.
- This index is for page structure only. It does not approve token edits or component-spec edits.
