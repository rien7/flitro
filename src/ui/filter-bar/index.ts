import { FilterBarRoot } from "./root";
import { FilterBarTrigger } from "./trigger";

export const FilterBar = Object.assign({}, {
  Root: FilterBarRoot,
  Trigger: FilterBarTrigger,
});

export { FilterBarRoot } from "./root";
export { FilterBarTrigger } from "./trigger";
export { FilterItems } from "./items";
export type {
  FilterBarContextType,
  FilterBarValue,
  FilterBarValueType,
} from "./context";
export {
  FilterBarContextProvider,
  useFilterBar,
} from "./context";
