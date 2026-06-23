---
name: wash-component
description: 洗组件并规范到 AgentOS 设计系统。Use when the user says “洗组件”, normalize a Figma component to existing tokens, clean up component naming/layer structure, explain the intended binding logic before writing, and after interaction is confirmed write/update the component's structured JSON spec so it renders in the repo's online component/tag surfaces.
---

# Wash Component

将 Figma 组件“洗”成仓库现有设计系统的一部分，范围包括：

1. 绑定现有 token（颜色、圆角、必要时尺寸/图标/文字样式）
2. 清理组件命名、图层命名、结构层次
3. 在用户确认交互/结构后，写入或更新 `tokens/components/{name}.json`
4. 让结构化数据进入 `src/design-system-data.js` 的线上展示链路

**不要修改 design token 定义本身。** 任何 `tokens/` 基础 token、语义 token、Figma Variables 值/命名/引用的变更，都必须先征得用户确认，遵守 `.cursor/rules/design-token-confirmation.mdc`。

## 先读这些文件

1. `AGENTS.md`
2. `tokens/components/README.md`
3. `workflows/normalize-design.md`
4. `src/design-system-data.js`
5. 若已有该组件 spec：`tokens/components/{name}.json`
6. 若无 spec：读最近似参考（优先 `button.json`、`input.json`、`radio.json`、`tag.json`）

## 何时触发

当用户说这些意思时使用：

- “洗组件”
- “把这个组件洗成我们的 token”
- “把这个 Figma 组件规范一下”
- “绑定到我们的 design system”
- “命名改得更有意义，结构清楚一点”
- “交互确认后写结构化数据 / 上线上 tags”

## 核心原则

### 1. 先解释你的理解，再写

在任何 Figma 写入前，必须先向用户说明：

- 你认为这个组件是什么组件
- 你准备怎样理解它的语义轴（例如 `Type`、`State`、`Size`、`Status`）
- 你准备把哪些颜色/圆角/文字样式绑定到哪些现有 token
- 你准备如何命名组件、变体轴、关键图层
- 哪些是安全自动映射，哪些是需要用户拍板的近似映射

然后等用户确认。

### 2. 组件命名必须有意义

遵守 `tokens/components/README.md` 里的全局命名规则，尤其是：

- 不要用 `Frame 1`、`Group 12`、`Property 1`
- 组件集名直接用领域名：`Button`、`Radio`、`Title`
- 变体轴名必须是显式业务/设计语义：`Type`、`Variant`、`State`、`Size`、`Status`
- 语义命名参照 `965:4885`：`Info|Danger|Success|Warning`
- 不要把原始颜色名当语义轴

### 3. 结构必须清楚

目标是得到稳定、可读、可继续维护的图层结构：

- 容器层：`container`
- 文字层：`label`、`title`、`description`
- 图标层：`iconLeft`、`iconRight`、`statusIcon`
- 分隔/装饰层：`divider`、`indicator`、`dot`

避免：

- 无意义 wrapper
- 重复嵌套
- 同层混合语义不同的对象

如果某个 wrapper 只是为了布局存在，可以命名为：

- `content`
- `header`
- `body`
- `footer`
- `meta`
- `actions`
- `preview`

## 组件清洗工作流

### Phase 0 — Discovery（只读）

1. 打开 Figma 节点，确认是组件集、组件、实例，还是示例容器
2. 读取：
   - 当前变量绑定
   - 当前文字样式
   - 当前图层命名
   - 当前变体轴
3. 判断：
   - 哪些已是本地 token
   - 哪些还是外来变量 / 硬编码
   - 哪些缺少结构化 spec
4. 若用户给的是示例容器而不是组件本体，要明确指出“本体是谁、容器是谁”

### Phase 1 — Explain + Confirm

向用户输出一份简短方案，至少包含：

- 组件识别：`这是 X，不是 Y`
- 拟绑定 token：
  - 颜色
  - 圆角
  - 文字样式
- 拟命名规则：
  - 组件集名
  - 变体轴
  - 关键图层
- 拟保留项：
  - 渐变
  - 透明占位描边
  - 暂不落 token 的特殊值
- 如果要写 JSON spec，说明将更新哪个文件

**没有用户确认，不进入写入。**

### Phase 2 — Execute（Figma 写入）

按这个顺序写：

1. 命名清理
   - 组件集
   - 变体名
   - 示例容器
   - 关键图层
2. 文字样式归一化
3. 颜色 token 绑定
4. 圆角 token 绑定
5. 需要时补尺寸/图标/间距变量绑定

约束：

- 只绑定到现有 token
- 整页重写时分批
- 不并行对同一文件做多次 `use_figma` 写入

### Phase 3 — Verify

至少验证三件事：

1. `textStyleId` 是否完整
2. 可见纯色 fill/stroke 是否都已挂本地变量
3. 命名是否已经变成可读语义名

必要时补一次 `get_variable_defs` / metadata / screenshot 回查。

## 交互确认后的结构化数据写入

当用户确认组件的：

- 交互状态
- 变体轴
- 结构层次
- token 绑定策略

就要把它写入 `tokens/components/{name}.json`，不要只停留在 Figma。

### 写入规则

1. 已有 spec：
   - 更新现有 `tokens/components/{name}.json`
2. 没有 spec：
   - 复制最近似 spec 为起点
   - 按 `tokens/components/README.md` 的读序补齐

至少维护这些字段：

- `component`
- `dna`
- `variantCount`
- `anatomy.layers`
- `variants`
- `naming`
- `layout`
- `styles`
- `styleResolution.rules`
- `figmaConventions.figmaImplemented`

如果是控制类组件，遵守 Control DNA；不要随意脱离 `rules/control.rules.json`。

## 上线上 tags / 线上展示的理解

这个仓库里的线上展示链路是：

`tokens/components/*.json` -> `src/design-system-data.js` -> Storybook / 在线组件目录

所以“渲染到线上的 tags”在这个仓库里的实际含义是：

1. 组件 spec JSON 被正确写入
2. `src/design-system-data.js` 能自动读到它
3. 对应 catalog / spec 页面可以显示出来

如果该组件还有真实 React 实现（如 `src/components/Tag.jsx`），则进一步校对组件实现与 spec 是否一致；没有实现时，至少保证 spec 被 catalog 正常消费。

## 需要你特别注意的判断

### 可以直接做

- 外来文字样式 -> 本地现有文字样式
- 硬编码纯色 -> 本地现有语义色 token
- 精确命中的圆角值 -> 本地 radius token
- `Frame 1` -> 语义化命名
- 补 `tokens/components/{name}.json` 中缺失但已确认的结构字段

### 必须先问用户

- 近似圆角映射，例如 `5 -> roundedMd6`
- 不存在精确文字样式时的替代方案
- 语义不清的颜色归类
- 新增 / 改名 / 改值 token
- 改动组件交互模型、变体轴定义、状态集合

## 交付物

每次“洗组件”完成后，应至少给出：

1. Figma 中改了什么
2. 哪些 token 被绑定
3. 哪些命名被规范
4. 是否已写入 `tokens/components/{name}.json`
5. 是否已经进入线上结构化展示链路

如果还没进入结构化数据阶段，要明确说：

- “当前只洗了 Figma，本轮还没写 spec JSON”

