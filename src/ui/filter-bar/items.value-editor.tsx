import { FieldKind, type EnumFieldKind } from "@/logical/field";
import type { FilterBarValue } from "@/ui/filter-bar/context";
import { isEmptyOperator } from "@/ui/filter-bar/state";
import type { UIFieldForKind } from "@/ui/types";

import { BooleanValueEditor } from "./items-editors/boolean-value-editor";
import { DateValueEditor } from "./items-editors/date-value-editor";
import { MultiSelectValueEditor } from "./items-editors/multi-select-value-editor";
import { NumberValueEditor } from "./items-editors/number-value-editor";
import { SelectValueEditor } from "./items-editors/select-value-editor";
import { StringValueEditor } from "./items-editors/string-value-editor";

export function FilterValueEditor<FieldId extends string, Kind extends EnumFieldKind>({
  field,
  item,
  onChange,
}: {
  field: UIFieldForKind<FieldId, Kind>;
  item: FilterBarValue<FieldId, Kind>;
  onChange: (value: FilterBarValue<FieldId, Kind>["value"]) => void;
}) {
  if (isEmptyOperator(item.operator)) {
    return null;
  }

  if (field.render) {
    return field.render({
      op: item.operator as never,
      value: item.value as never,
      onChange: (value) => onChange(value as FilterBarValue<FieldId, Kind>["value"]),
    });
  }

  switch (field.kind) {
    case FieldKind.string:
      return (
        <StringValueEditor
          field={field as UIFieldForKind<FieldId, typeof FieldKind.string>}
          item={item as unknown as FilterBarValue<FieldId, typeof FieldKind.string>}
          onChange={onChange as (value: FilterBarValue<FieldId, typeof FieldKind.string>["value"]) => void}
        />
      );
    case FieldKind.number:
      return (
        <NumberValueEditor
          field={field as UIFieldForKind<FieldId, typeof FieldKind.number>}
          item={item as unknown as FilterBarValue<FieldId, typeof FieldKind.number>}
          onChange={onChange as (value: FilterBarValue<FieldId, typeof FieldKind.number>["value"]) => void}
        />
      );
    case FieldKind.date:
      return (
        <DateValueEditor
          field={field as UIFieldForKind<FieldId, typeof FieldKind.date>}
          item={item as unknown as FilterBarValue<FieldId, typeof FieldKind.date>}
          onChange={onChange as (value: FilterBarValue<FieldId, typeof FieldKind.date>["value"]) => void}
        />
      );
    case FieldKind.select:
      return (
        <SelectValueEditor
          field={field as UIFieldForKind<FieldId, typeof FieldKind.select>}
          item={item as unknown as FilterBarValue<FieldId, typeof FieldKind.select>}
          onChange={onChange as (value: FilterBarValue<FieldId, typeof FieldKind.select>["value"]) => void}
        />
      );
    case FieldKind.multiSelect:
      return (
        <MultiSelectValueEditor
          field={field as UIFieldForKind<FieldId, typeof FieldKind.multiSelect>}
          item={item as unknown as FilterBarValue<FieldId, typeof FieldKind.multiSelect>}
          onChange={onChange as (value: FilterBarValue<FieldId, typeof FieldKind.multiSelect>["value"]) => void}
        />
      );
    case FieldKind.boolean:
      return (
        <BooleanValueEditor
          field={field as UIFieldForKind<FieldId, typeof FieldKind.boolean>}
          item={item as unknown as FilterBarValue<FieldId, typeof FieldKind.boolean>}
          onChange={onChange as (value: FilterBarValue<FieldId, typeof FieldKind.boolean>["value"]) => void}
        />
      );
    default:
      return null;
  }
}
