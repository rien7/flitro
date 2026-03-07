import { FieldKind } from "@/logical/field";
import { Switch } from "@/ui/baseui/switch";

import type { FilterValueEditorProps } from "./shared";

export function BooleanValueEditor<FieldId extends string>({
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.boolean>) {
  return (
    <label className="flex h-9 items-center justify-between gap-3 px-3 text-sm">
      <span className="text-muted-foreground">
        {item.value ? "True" : "False"}
      </span>
      <Switch
        checked={Boolean(item.value)}
        onCheckedChange={onChange}
      />
    </label>
  );
}
