import { useState, type ReactNode } from "react";
import { type EnumFieldKind } from "@/logical/field";
import type { FieldDefinition } from "@/ui/builder";
import { getUIFieldFromBuilder, isFieldGroupDefinition } from "@/ui/builder";
import {
  FilterBarContextProvider,
  type FilterBarValueType,
} from "@/ui/filter-bar/context";
import type { UIFieldEntry } from "@/ui/types";

interface FilterBarRootProps<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind,
> {
  fields: FieldDefinition<FieldId, Kind>[];
  children?: ReactNode;
  iconMapping?: boolean | Partial<Record<EnumFieldKind, ReactNode>>;
}

export function FilterBarRoot<FieldId extends string, Kind extends EnumFieldKind>({
  fields,
  children,
}: FilterBarRootProps<FieldId, Kind>) {
  const uiFieldEntries = fields.map((field) => {
    if (isFieldGroupDefinition(field)) {
      return {
        label: field.label,
        fields: field.fields.map((groupField) => getUIFieldFromBuilder(groupField)),
      };
    }

    return getUIFieldFromBuilder(field);
  }) as UIFieldEntry<FieldId, Kind>[];
  const uiFields = uiFieldEntries.flatMap((entry) =>
    "fields" in entry ? entry.fields : [entry],
  );
  const [values, setValues] = useState<FilterBarValueType>([])
  return (
    <FilterBarContextProvider value={{
      uiFieldEntries,
      uiFields,
      values,
      setValues
    }}>
      {children}
    </FilterBarContextProvider>
  );
}
