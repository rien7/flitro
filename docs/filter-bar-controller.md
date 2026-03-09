# FilterBar Controller

`FilterBar.Root` 仍然只是一个编辑 `FilterBarValue[]` 的 UI。

如果你的页面需要区分：

- 正在编辑的 filters
- 已经提交给请求层 / URL / store 的 filters

推荐使用 `useFilterBarController()`

## 1. 设计边界

`controller` 不是 `Root` 的 prop，也不会进入内部 context。

职责分层固定为：

- `FilterBar.Root`：编辑 `value`
- `useFilterBarController()`：协调 `draftValue` 和 `appliedValue`
- `filtro/nuqs`、router、store：消费 `appliedValue`

`Root` 继续只接：

```ts
value?: FilterBarValueType;
onChange?: (
  nextValue: FilterBarValueType,
  meta?: FilterBarChangeMeta,
) => void;
defaultValue?: FilterBarValueType;
```

## 2. Hook API

```ts
import {
  useFilterBarController,
  type FilterBarApplyMeta,
  type FilterBarChangeMeta,
} from "filtro";

type UseFilterBarControllerOptions = {
  defaultValue?: FilterBarValueType;
  appliedValue?: FilterBarValueType;
  onAppliedChange?: (
    nextValue: FilterBarValueType,
    meta: FilterBarApplyMeta,
  ) => void;
  applyMode?: "auto" | "manual";
  debounceMs?: number;
};

type FilterBarController = {
  draftValue: FilterBarValueType;
  onDraftChange: (
    nextValue: FilterBarValueType,
    meta?: FilterBarChangeMeta,
  ) => void;
  appliedValue: FilterBarValueType;
  apply: () => void;
  clear: () => void;
  discardChanges: () => void;
  isDirty: boolean;
};
```

语义：

- `draftValue`: 当前 UI 正在编辑的值
- `onDraftChange`: 传给 `FilterBar.Root` 的受控回调
- `appliedValue`: 当前真正给业务消费的值
- `apply()`: 显式把 draft 提升为 applied
- `clear()`: 清空 draft，不自动提交
- `discardChanges()`: 丢弃 draft，回到当前 applied
- `isDirty`: `draftValue` 和 `appliedValue` 是否不同

## 3. 最常见用法

```tsx
import { FilterBar, filtro, useFilterBarController } from "filtro";

const fields = [
  filtro.string("keyword").label("Keyword"),
  filtro.select("status").label("Status").options([
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
  ]),
];

export function Filters() {
  const filters = useFilterBarController({
    defaultValue: [],
    applyMode: "manual",
  });

  return (
    <>
      <FilterBar.Root
        fields={fields}
        value={filters.draftValue}
        onChange={filters.onDraftChange}
      >
        <FilterBar.Trigger render={<button type="button" />}>
          Add Filter
        </FilterBar.Trigger>
        <FilterBar.Clear render={<button type="button" />}>
          Clear
        </FilterBar.Clear>
        <FilterBar.ActiveItems />
      </FilterBar.Root>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={filters.apply}
          disabled={!filters.isDirty}
        >
          Apply
        </button>
        <button
          type="button"
          onClick={filters.clear}
        >
          Clear draft
        </button>
        <button
          type="button"
          onClick={filters.discardChanges}
          disabled={!filters.isDirty}
        >
          Discard changes
        </button>
      </div>
    </>
  );
}
```

## 4. 自动 Apply

`applyMode: "manual"` 时，controller 不自动提交。

`applyMode: "auto"` 时，controller 根据 `FilterBarChangeMeta` 自动决定：

- 立即 apply
- debounce apply
- 跳过这次提交

第一版的默认规则固定为：

- `clear` => skip
- `remove` => apply
- `add` 且 `completeness === "incomplete"` => skip
- `add` 且 `completeness === "complete"` => apply
- `operator` 且 `completeness === "incomplete"` => skip
- `operator` 且 `completeness === "complete"` => apply
- `value` 且 `completeness === "incomplete"` => skip
- `value` 且 `valueChangeKind === "typing"` 且 `completeness === "complete"` => debounce
- `value` 且 `valueChangeKind === "selected"` 且 `completeness === "complete"` => apply

`debounceMs` 只在自动模式下的 typing 变更生效。

## 5. `FilterBarChangeMeta`

`onChange(nextValue, meta)` 的 `meta` 只描述这次编辑事实，不描述 apply 策略。

```ts
type FilterBarChangeMeta<FieldId extends string = string> =
  | {
      action: "clear";
    }
  | {
      action: "remove";
      fieldId: FieldId;
    }
  | {
      action: "add";
      fieldId: FieldId;
      completeness: "complete" | "incomplete";
    }
  | {
      action: "operator";
      fieldId: FieldId;
      completeness: "complete" | "incomplete";
    }
  | {
      action: "value";
      fieldId: FieldId;
      valueChangeKind: "typing" | "selected";
      completeness: "complete" | "incomplete";
    };
```

这意味着：

- `FilterBar.Clear` 会发出 `{ action: "clear" }`
- 删除条件会发出 `{ action: "remove", fieldId }`
- 文本类 editor 会发出 `valueChangeKind: "typing"`
- 选择类 editor 会发出 `valueChangeKind: "selected"`

## 6. 与 `filtro/nuqs` 组合

组合方式固定为：

- `Root` 消费 controller 的 draft 通道
- `nuqs` 消费 controller 的 applied 通道

```tsx
import { FilterBar, filtro, useFilterBarController } from "filtro";
import { useNuqsFilterBarState } from "filtro/nuqs";

const fields = [
  filtro.string("keyword").label("Keyword"),
  filtro.select("status").label("Status").options([
    { label: "Open", value: "open" },
    { label: "Closed", value: "closed" },
  ]),
];

export function UrlBackedFilters() {
  const urlState = useNuqsFilterBarState({
    fields,
    history: "replace",
  });

  const filters = useFilterBarController({
    appliedValue: urlState.value,
    onAppliedChange: urlState.onChange,
    applyMode: "manual",
  });

  return (
    <FilterBar.Root
      fields={fields}
      value={filters.draftValue}
      onChange={filters.onDraftChange}
    >
      <FilterBar.Trigger render={<button type="button" />}>
        Add Filter
      </FilterBar.Trigger>
      <FilterBar.Clear render={<button type="button" />}>
        Clear
      </FilterBar.Clear>
      <FilterBar.ActiveItems />
    </FilterBar.Root>
  );
}
```

这条接法下：

- URL 持有 applied filters
- controller 持有 draft filters
- `apply()` 时才把 draft 写回 URL

第一版推荐 `history: "replace"`。

## 7. 同步规则

controller 的同步规则固定为：

- 外部 `appliedValue` 是 authoritative state
- 外部 `appliedValue` 变化时，controller 直接把 `draftValue` 同步成新的 `appliedValue`
- 外部 `appliedValue` 变化后，`isDirty` 变成 `false`
- `defaultValue` 只参与初始化
- 初始化优先级是 `appliedValue` 高于 `defaultValue`

## 8. 当前不做的事

第一版不支持：

- 外部受控 `draftValue / onDraftChange`
- `controller={...}` 直接传给 `FilterBar.Root`
- 自定义自动 apply 策略函数
- 把 controller 放进 `FilterBar` 内部 context
