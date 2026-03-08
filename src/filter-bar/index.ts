import { FilterBarRoot } from "./root";
import { FilterItems } from "./items";
import { FilterBarTrigger } from "./trigger";
import { FilterBarClear } from "./clear";
import { FilterBarSaveView } from "./save-view";
import { FilterBarThemeProvider, headlessFilterBarTheme } from "./theme";
import { FilterBarViews } from "./views";

export const FilterBar = Object.assign({}, {
  Root: FilterBarRoot,
  Items: FilterItems,
  Trigger: FilterBarTrigger,
  Clear: FilterBarClear,
  SaveView: FilterBarSaveView,
  Views: FilterBarViews,
  ThemeProvider: FilterBarThemeProvider,
  headlessTheme: headlessFilterBarTheme,
});

export {
  type AnyFieldBuilder,
  filtro,
  type BaseFieldBuilder,
  type BooleanFieldBuilder,
  type FieldBuilder,
  type FieldDefinition,
  type FieldGroupDefinition,
  type SelectFieldBuilder,
} from "./builder";
export { groupField, type FieldGroup } from "./group";
export * from "./types";
export { FilterBarRoot } from "./root";
export { FilterItems } from "./items";
export { FilterBarTrigger } from "./trigger";
export { FilterBarSaveView } from "./save-view";
export { FilterBarViews } from "./views";
export {
  headlessFilterBarTheme,
  FilterBarThemeProvider,
  mergeFilterBarTheme,
  useFilterBarTheme,
} from "./theme";
export type {
  FilterBarContextType,
  FilterBarSavedView,
  FilterBarSavedViewType,
  FilterBarValue,
  FilterBarValueType,
} from "./context";
export type {
  FilterBarTheme,
  FilterBarThemeClassNameSlot,
  FilterBarThemeIcons,
  FilterBarThemeInput,
  FilterBarThemeTexts,
} from "./theme";
export {
  FilterBarContextProvider,
  useFilterBar,
} from "./context";
export {
  areFilterBarValuesEqual,
  deserializeFilterBarValue,
  getFilterBarQueryKeys,
  isEmptyOperator,
  isFilterBarValueEqual,
  resolveFilterBarFields,
  sanitizeFilterBarValue,
  sanitizeFilterBarValues,
  serializeFilterBarValue,
} from "./value";
export type {
  FilterBarQueryKeys,
  FilterBarQueryState,
  FilterBarQueryStatePrimitive,
  ResolvedFilterBarFields,
  SerializedFilterBarValue,
} from "./value";
