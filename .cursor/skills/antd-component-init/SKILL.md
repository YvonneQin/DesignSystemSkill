---
name: antd-component-init
description: 将 Ant Design 组件结构化为 Control DNA JSON spec，并在 AgentOS Figma 文件中初始化组件集。适用于用户要求新增/脚手架/初始化 antd 组件（Button、Input、Select 等）、创建 tokens/components/{name}.json、或在 AgentOS-Design-System 中搭建 component set 的场景。
---

# Ant Design 组件初始化

两阶段工作流：**先写 spec**（仓库 JSON），**再初始化 Figma**（组件集 + token 绑定）。

目标文件：[AgentOS Design System](https://www.figma.com/design/MwUyizdlqXKyFzHJWvBtI8/AgentOS-Design-System) — `fileKey: MwUyizdlqXKyFzHJWvBtI8`。

参考实现：`tokens/components/button.json`。

## 读文件顺序

1. `AGENTS.md`
2. `tokens/components/README.md`
3. `tokens/components/_control-gene.schema.json`
4. `tokens/components/_control-gene.template.json`
5. 最近似的参考实现（优先 `button.json`，其次 `tag.json`）

规则：**组件 spec 是 Figma 的上游，不要先做 Figma 再回填 JSON。**

## 前置依赖

| Skill / 文档 | 何时加载 |
|-------------|---------|
| `figma-use` | 每次调用 `use_figma` 前**必须**加载 |
| `figma-generate-library` | 创建组件集、变体、变量绑定 |
| `tokens/components/README.md` | Control DNA 模型 |
| `_control-gene.schema.json` | 基因定义 + `extensionGuide.{component}` |
| `_control-gene.template.json` | 起始 JSON 模板 |

绑定前须确认 Figma 中已有基础 token（`Vision Token`、`ColorMode`、`Font`、`Effect`）。

> **强制规则**：新增/修改/删除 design token（仓库 `tokens/` 或 Figma Variables）前**必须先询问用户**。详见 `.cursor/rules/design-token-confirmation.mdc`。

---

## Phase 0 — 调研（只读）

```
- [ ] 确认组件名（antd API 名，如 Input、Select、Checkbox）
- [ ] 阅读 antd 文档：props → 变体轴（type、size、status、disabled …）
- [ ] 阅读 _control-gene.schema.json → extensionGuide.{component}（如有）
- [ ] 检查现有 Figma 文件：页面、图标库、共享样式
- [ ] 列出组件所需 foundation token，标记缺口
```

变体轴有歧义时**先问用户**（例如独立 danger 轴 vs `Theme=Red`）。

---

## Phase 1 — 结构化 spec（仓库）

复制 `tokens/components/_control-gene.template.json` → `tokens/components/{component}.json`。

### 必填章节

| 章节 | 用途 |
|------|------|
| `component`、`dna`、`variantCount` | 组件身份 |
| `anatomy.layers` | Figma 图层树与职责 |
| `variants` | API 轴 + Figma 专用 state 轴 |
| `naming.figma` | 变体属性字符串，如 `Size={Size}, State={State}` |
| `layout` | 共用间距、图标、线宽 |
| `sizes` | 各尺寸的 height、padding、radius、typography、iconSize |
| `styles` | 样式块 × 状态 → 语义 token 引用 |
| `styleResolution.rules` | 横切组合规则（danger、ghost、theme、dashed） |
| `antd` | import、prop 映射、代码示例 |
| `figmaConventions` | 页面规则、矩阵布局、`figmaImplemented` 占位 |
| `mappingCoverage` | 已映射 vs 缺口 token |

### 变体设计规则

1. **API 轴** → 真实 Figma 组件属性（`Type`、`Size`、`Theme` …）
2. **Figma 专用轴** → `State` 用于设计预览（`Default`、`Hover`、`Loading`、`Active`、`Disabled`）
3. **通过 `styleResolution` 组合** — 不为 danger/ghost/theme 爆炸变体数量
4. **每个组件优先一个合并组件集**（参考 Button：用 Theme 轴代替 3 个独立 set）

### 注册

在 `tokens/groups.json` → `Components` 下添加条目。

写入 Figma **之前**向用户展示 spec 摘要并确认。

### Phase 1 输出要求

- `variantCount` 已填写并与轴数量基本一致
- `styles` / `styleResolution` 可推导出每个变体外观
- 未映射项写入 `mappingCoverage.gaps`
- 若发现缺少 token，只列缺口，不直接补 token

---

## Phase 2 — Figma 初始化

加载 `figma-use` + `figma-generate-library`。

### 页面规范

| 规则 | 说明 |
|------|------|
| 页面名 | `{Component} {中文}`，如 `Button 按钮` |
| 页面内容 | **仅**组件集 — 不放标签、矩阵、文档框 |
| 组件集名 | `*{ComponentName}*`（星号命名约定） |

### 组件集

1. 按 anatomy 创建基础变体（container 自动布局 + content 图层）
2. 按 `naming.figma` 添加变体属性
3. 生成全部变体；单次 `use_figma` 超过 80 节点时分批
4. 布局：Ant Design 矩阵 — **Theme 块（纵向堆叠）→ State 列 → Type 子列 → Size 行 × Shape 区**
5. 行 Y 坐标按实际高度 + 间距累加（不要用固定倍数）

### Boolean / INSTANCE_SWAP 属性

记录在 `figmaConventions.componentProperties`：

| 类型 | 示例 |
|------|------|
| BOOLEAN | `ShowLeftIcon` → `Icon.visible` |
| INSTANCE_SWAP | `IconValue` → `Icon.mainComponent` |

### Token 绑定（每个变体）

按 spec 路径绑定 — 有 token 时禁止写死 hex/radius/px：

| 属性 | Token 路径示例 |
|------|---------------|
| 高度 | `controlHeight/controlHeightMd32` |
| paddingLeft/Right | `padding/paddingXs8`、`padding/padding6`（small） |
| itemSpacing | `padding/paddingXxs4` |
| cornerRadius | `radius/roundedLg8`、`radius/roundedFull999` |
| fills / strokes | 经 `styleResolution` 解析的 `Brand/*`、`Neutral/*` |
| icon 宽高 | `iconSize/iconSizeMd16`、`iconSize/iconSizeSm12` |
| 文字 | 字体样式 + `Neutral/Text/*` 或 `Brand/*` |
| 效果 | `Component/{Component}/*` |

**图标颜色**绑定到 `Icon > Vector.fills`，不是 INSTANCE 根节点。

### 初始化后

更新 spec 中的 `figmaConventions.figmaImplemented`：

```json
"figmaImplemented": {
  "fileKey": "MwUyizdlqXKyFzHJWvBtI8",
  "pageId": "<page-node-id>",
  "componentSetId": "<set-node-id>",
  "variantCount": 0
}
```

---

## Phase 3 — 验证

```
- [ ] 元数据：变体数量与 spec 一致
- [ ] 抽样变体：container、文字、图标、圆角、padding 均已绑定变量
- [ ] 组件集截图
- [ ] 更新 mappingCoverage.gaps
```

## 禁止事项

- 不要先改 Figma 再补 spec
- 不要在组件页放 showcase、说明文档框、实例预览墙
- 不要因为缺 token 就直接改 `tokens/` 或写 Figma Variables
- 不要把 `scripts/figma/*.js` 当成本地 Node 脚本执行

---

## 用户确认节点

| 节点 | 时机 |
|------|------|
| **Design token 变更** | 任何 token 新增/改名/改值/删库/Figma Variables 写入前 — **必须先问** |
| Spec 评审 | Phase 1 完成后、写 Figma 前 |
| 绑定报告 | 批量绑色/圆角/token 前 |
| 范围确认 | 大文件整页扫描 vs 仅选区 |

---

## 关联 Skill

| 任务 | Skill |
|------|-------|
| 绑硬编码颜色 | `figma-bind-colors` |
| 绑圆角 | `figma-bind-radius` |
| Token JSON / 主题构建 | `workflows/create-tokens.md` |
| 通用路由 | `ds-orchestrator` |

## 延伸阅读

- 绑定清单与 Button 模式：[reference.md](reference.md)
