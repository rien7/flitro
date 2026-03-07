import { FilterBarRoot } from "./root";
import { FilterItems } from "./items";
import { FilterBarTrigger } from "./trigger";

export const FilterBar = Object.assign({}, {
  Root: FilterBarRoot,
  Items: FilterItems,
  Trigger: FilterBarTrigger,
});

export { FilterBarRoot } from "./root";
export { FilterItems } from "./items";
export { FilterBarTrigger } from "./trigger";
export type {
  FilterBarContextType,
  FilterBarValue,
  FilterBarValueType,
} from "./context";
export {
  FilterBarContextProvider,
  useFilterBar,
} from "./context";
