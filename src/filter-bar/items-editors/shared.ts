import type { EnumFieldKind } from "@/logical/field";
import type { FilterBarValue } from "@/filter-bar/context";
import type { FlattenedSelectOption } from "@/filter-bar/types";
import type { UIFieldForKind } from "@/filter-bar/types";

export interface FilterValueEditorProps<
  FieldId extends string,
  Kind extends EnumFieldKind,
> {
  field: UIFieldForKind<FieldId, Kind>;
  item: FilterBarValue<FieldId, Kind>;
  onChange: (value: FilterBarValue<FieldId, Kind>["value"]) => void;
  onValidationChange: ((message: string | null) => void) | undefined;
  errorDescriptionId: string | undefined;
}

export function stringifyArrayValue(value: string[]) {
  return value.join(", ");
}

export function getOptionLabel(
  value: string | null | undefined,
  options: FlattenedSelectOption[],
) {
  if (!value) {
    return null;
  }

  return options.find((option) => option.value === value)?.label ?? value;
}
