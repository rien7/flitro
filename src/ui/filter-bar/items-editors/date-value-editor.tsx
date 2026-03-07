import { FieldKind } from "@/logical/field";
import { DateOperatorKind } from "@/logical/operator";
import { Input } from "@/ui/baseui/input";

import type { FilterValueEditorProps } from "./shared";
import { getToday, updateTupleValue } from "./shared";

export function DateValueEditor<FieldId extends string>({
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.date>) {
  if (item.operator === DateOperatorKind.lastNDays || item.operator === DateOperatorKind.nextNDays) {
    return (
      <Input
        className="rounded-none border-0 shadow-none focus-visible:ring-0"
        type="number"
        min="1"
        value={typeof item.value === "number" ? String(item.value) : "7"}
        onChange={(event) => onChange(Number(event.currentTarget.value || 1))}
      />
    );
  }

  if (item.operator === DateOperatorKind.between || item.operator === DateOperatorKind.notBetween) {
    const tuple = Array.isArray(item.value) ? item.value : [getToday(), getToday()];

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          className="rounded-none border-0 shadow-none focus-visible:ring-0"
          type="date"
          value={tuple[0] ?? getToday()}
          onChange={(event) => onChange(updateTupleValue(tuple, 0, event.currentTarget.value))}
        />
        <Input
          className="rounded-none border-0 border-l shadow-none focus-visible:ring-0"
          type="date"
          value={tuple[1] ?? getToday()}
          onChange={(event) => onChange(updateTupleValue(tuple, 1, event.currentTarget.value))}
        />
      </div>
    );
  }

  return (
    <Input
      className="rounded-none border-0 shadow-none focus-visible:ring-0"
      type="date"
      value={typeof item.value === "string" ? item.value : getToday()}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
