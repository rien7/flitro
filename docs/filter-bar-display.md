# FilterBar Field Display

`FilterBar` 现在支持三种字段显示方式：

- `default`
- `suggested`
- `pinned`

它们解决的是“字段如何出现在 UI 中”，不是新的过滤语义。

底层规则保持不变：

- `FilterBarValue[]` 仍然只保存当前生效的条件
- `logical` 层不引入展示语义
- 不支持重复字段条件或嵌套分组

## 1. Builder API

字段显示方式通过 builder metadata 声明：

```tsx
import { filtro } from "filtro";

const fields = [
  filtro.select("status")
    .label("Status")
    .pin()
    .options([
      { label: "Open", value: "open" },
      { label: "Closed", value: "closed" },
    ]),
  filtro.string("keyword")
    .label("Keyword")
    .suggest({
      seed: {
        operator: "contains",
        value: "",
      },
    }),
  filtro.boolean("archived")
    .label("Archived")
    .options([
      { label: "Archived", value: true },
      { label: "Not Archived", value: false },
    ]),
];
```

可用方法：

- `.pin()`
- `.suggest(config?)`

默认情况下，字段就是普通 `default` item，不需要额外声明。

## 2. 渲染结构

如果你要使用 pinned / suggested 能力，推荐显式渲染完整内容区：

```tsx
import { FilterBar } from "filtro";

<FilterBar.Root fields={fields}>
  <div className="toolbar">
    <FilterBar.Trigger render={<button type="button" />}>
      Add Filter
    </FilterBar.Trigger>
    <FilterBar.Clear render={<button type="button" />}>
      Clear
    </FilterBar.Clear>
  </div>
  <FilterBar.Content>
    <FilterBar.PinnedItems />
    <FilterBar.ActiveItems />
    <FilterBar.SuggestedItems />
  </FilterBar.Content>
</FilterBar.Root>
```

职责划分：

- `FilterBar.Content`
  - item 的主内容区容器

- `FilterBar.PinnedItems`
  - 渲染所有 pinned 字段
  - 没有 active value 时，仍然显示空态 row

- `FilterBar.ActiveItems`
  - 渲染普通 active / draft rows
  - suggestion 一旦被点击，也进入这里

- `FilterBar.SuggestedItems`
  - 只渲染未激活的 suggestion 入口
  - 点击后进入 `ActiveItems`

使用前提：

- 只要字段用了 `.pin()`，就应该渲染 `FilterBar.PinnedItems`
- 如果 suggestion 配了 `showInMenu: false`，也应该渲染 `FilterBar.SuggestedItems`
- 否则这些字段可能不会出现在任何可见入口里

## 3. Active Value 语义

显示方式不改变 active value 规则。

`FilterBarValue[]` 里只保留“有意义的条件”：

- `string`
  - `""` 自动视为不存在
- `multiSelect`
  - `[]` 自动视为不存在
- 其它字段
  - `null` 自动视为不存在
- `isEmpty` / `isNotEmpty`
  - 仍然是有效条件，不会因为 `value === null` 被移除

这意味着：

- pinned 字段清空后，会从 active values 移除，但 row 仍继续显示
- suggested 字段清空后，会从 active values 移除，然后按 `removeBehavior` 回流

## 4. 运行时区域属性

字段 metadata 的 `default / suggested / pinned` 只负责派生 UI 位置。

真正渲染到 DOM 时，当前实现统一暴露 `data-area`：

- pinned row: `data-area="pinned"`
- active row: `data-area="active"`
- suggestion button: `data-area="suggestion"`

这层属性只描述“当前元素出现在什么区域”，不再混入历史上的 `placement` 或 `row-source` 语义。

## 5. Suggested 配置

`suggest()` 支持三类配置：

```tsx
filtro.string("keyword")
  .label("Keyword")
  .suggest({
    seed: {
      operator: "contains",
      value: "",
    },
    removeBehavior: "back-to-suggestion",
    showInMenu: true,
  });
```

含义：

- `seed`
  - suggestion 点击后的初始草稿
- `removeBehavior`
  - `"back-to-suggestion"`: 删除或清空后回到 suggestion 区
  - `"back-to-menu"`: 删除或清空后从 suggestion 区消失，只保留 menu 入口
- `showInMenu`
  - `true`: 未激活时仍然保留在 `Trigger` 菜单中
  - `false`: 未激活时只通过 suggestion 区暴露

如果 `seed` 本身不是有效 active condition，点击 suggestion 后会先进入内部 draft state，而不是立刻进入 `values`。

## 6. Clear / Remove 行为

- 普通 item 删除后直接从 `values` 消失
- suggested item 删除后从 `values` 移除，并按 `removeBehavior` 回流
- pinned item 不显示删除按钮；清空后只会 reset 值，不会移除 pinned row
- `FilterBar.Clear` 只清空 active values
  - pinned row 会回到空态
  - suggestion 会重新出现，或按 `back-to-menu` 保持收起

## 7. 当前边界

这版显示方式实现刻意收窄范围：

- 不包含 `select` / `multiSelect` 的 editorVariant
- 不包含 segment / chips / expand 展示变体
- 不改 `FilterBarValue[]` 的 flat active model

相关文档：

- [docs/filter-bar-styling.md](https://github.com/rien7/filtro/blob/main/docs/filter-bar-styling.md)
- [docs/filter-bar-controller.md](https://github.com/rien7/filtro/blob/main/docs/filter-bar-controller.md)
- [README.md](https://github.com/rien7/filtro/blob/main/README.md)
