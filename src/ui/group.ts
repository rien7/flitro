import type { EnumFieldKind } from "../logical/field.js";
import type { FieldBuilder, FieldGroupDefinition } from "./builder.js";

export type FieldGroup<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind,
> = FieldGroupDefinition<FieldId, Kind>;

export function groupField<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind,
>(
  label: string,
  fields: FieldBuilder<FieldId, Kind>[],
): FieldGroup<FieldId, Kind> {
  return {
    label,
    fields,
  };
}
