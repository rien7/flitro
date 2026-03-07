import type { EnumFieldKind, OperatorKindFor, OperatorValueFor } from "@/logical";
import type { UIFieldForKind } from "@/ui/types";
import { createContext, useContext, type Dispatch, type SetStateAction } from "react";

export interface FilterBarValue<
  FieldId extends string,
  Kind extends EnumFieldKind,
  Op extends OperatorKindFor<Kind> = OperatorKindFor<Kind>
> {
  field: FieldId,
  kind: Kind,
  operator: Op
  allowOperators: Op[]
  value: OperatorValueFor<Kind, Op> | null
}

export type FilterBarValueType<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind
> = Record<FieldId, FilterBarValue<FieldId, Kind>>

export interface FilterBarContextType<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind
> {
  uiFields: UIFieldForKind<FieldId, Kind>[],
  values: FilterBarValueType,
  setValues: Dispatch<SetStateAction<FilterBarValueType>> | null,
}

const FilterBarContext = createContext<FilterBarContextType>({
  uiFields: [],
  values: {},
  setValues: null
})

export const useFilterBar = () => useContext(FilterBarContext)
export const FilterBarContextProvider = FilterBarContext.Provider
