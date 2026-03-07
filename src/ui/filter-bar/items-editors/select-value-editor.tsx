import { FieldKind } from "@/logical/field";
import { Input } from "@/ui/baseui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/baseui/select";
import { flattenSelectOptions, isStaticSelectField } from "@/ui/filter-bar/state";

import type { FilterValueEditorProps } from "./shared";

export function SelectValueEditor<FieldId extends string>({
  field,
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.select>) {
  const currentValue = item.value as string | null;

  if (!isStaticSelectField(field)) {
    return (
      <Input
        className="rounded-none border-0 shadow-none focus-visible:ring-0"
        value={currentValue ?? ""}
        placeholder={field.placeholder ?? "Enter a value"}
        onChange={(event) => onChange(event.currentTarget.value)}
      />
    );
  }

  const options = flattenSelectOptions(field.options);
  const value = typeof currentValue === "string" ? currentValue : null;

  return (
    <Select<string> value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-none border-0 shadow-none focus-visible:ring-0">
        <SelectValue placeholder={field.placeholder ?? "Select an option"} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
