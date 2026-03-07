import { FieldKind } from "@/logical/field";
import { Input } from "@/ui/baseui/input";

import type { FilterValueEditorProps } from "./shared";

export function StringValueEditor<FieldId extends string>({
  field,
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.string>) {
  return (
    <Input
      className="rounded-none border-0 shadow-none focus-visible:ring-0"
      value={typeof item.value === "string" ? item.value : ""}
      placeholder={field.placeholder ?? "Type a value"}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
