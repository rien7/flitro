import type { EnumFieldKind } from "@/logical/field";
import type { FilterBarValue } from "@/ui/filter-bar/context";
import type { UIFieldForKind } from "@/ui/types";

export interface FilterValueEditorProps<
  FieldId extends string,
  Kind extends EnumFieldKind,
> {
  field: UIFieldForKind<FieldId, Kind>;
  item: FilterBarValue<FieldId, Kind>;
  onChange: (value: FilterBarValue<FieldId, Kind>["value"]) => void;
}

export function updateTupleValue<T>(value: T[] | null, index: number, nextValue: T) {
  const nextTuple = value ? [...value] : [];
  nextTuple[index] = nextValue;
  return nextTuple as [T, T];
}

export function stringifyArrayValue(value: string[]) {
  return value.join(", ");
}

export function getOptionLabels(values: string[], options: Array<{ label: string; value: string }>) {
  return values
    .map((entry) => options.find((option) => option.value === entry)?.label ?? entry)
    .join(", ");
}

export function getToday() {
  return new Date().toISOString().slice(0, 10);
}
