import { FieldKind } from "@/logical/field";
import { NumberOperatorKind } from "@/logical/operator";
import { Input } from "@/ui/baseui/input";

import type { FilterValueEditorProps } from "./shared";
import { updateTupleValue } from "./shared";

export function NumberValueEditor<FieldId extends string>({
  field,
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.number>) {
  if (item.operator === NumberOperatorKind.between || item.operator === NumberOperatorKind.notBetween) {
    const tuple = Array.isArray(item.value) ? item.value : [0, 0];

    return (
      <div className="grid gap-2 sm:grid-cols-2">
        <Input
          className="rounded-none border-0 shadow-none focus-visible:ring-0"
          type="number"
          value={String(tuple[0] ?? 0)}
          placeholder="Min"
          onChange={(event) => onChange(updateTupleValue(tuple, 0, Number(event.currentTarget.value || 0)))}
        />
        <Input
          className="rounded-none border-0 border-l shadow-none focus-visible:ring-0"
          type="number"
          value={String(tuple[1] ?? 0)}
          placeholder="Max"
          onChange={(event) => onChange(updateTupleValue(tuple, 1, Number(event.currentTarget.value || 0)))}
        />
      </div>
    );
  }

  return (
    <Input
      className="rounded-none border-0 shadow-none focus-visible:ring-0"
      type="number"
      value={typeof item.value === "number" ? String(item.value) : "0"}
      placeholder={field.placeholder ?? "Enter a number"}
      onChange={(event) => onChange(Number(event.currentTarget.value || 0))}
    />
  );
}
