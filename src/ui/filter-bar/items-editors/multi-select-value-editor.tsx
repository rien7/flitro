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
import { getOptionLabels, stringifyArrayValue } from "./shared";

export function MultiSelectValueEditor<FieldId extends string>({
  field,
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.multiSelect>) {
  const currentValue = item.value as string[] | null;
  const value = Array.isArray(currentValue) ? currentValue : [];

  if (!isStaticSelectField(field)) {
    return (
      <Input
        className="rounded-none border-0 shadow-none focus-visible:ring-0"
        value={stringifyArrayValue(value)}
        placeholder={field.placeholder ?? "Enter comma-separated values"}
        onChange={(event) =>
          onChange(
            event.currentTarget.value
              .split(",")
              .map((part) => part.trim())
              .filter(Boolean),
          )
        }
      />
    );
  }

  const options = flattenSelectOptions(field.options);
  const labels = getOptionLabels(value, options);

  return (
    <Select<string, true> multiple value={value} onValueChange={onChange}>
      <SelectTrigger className="rounded-none border-0 shadow-none focus-visible:ring-0">
        <SelectValue>
          {() => labels || field.placeholder || "Select options"}
        </SelectValue>
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
