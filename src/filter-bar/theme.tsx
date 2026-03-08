import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
  type ReactNode,
} from "react";

import type { EnumFieldKind } from "@/logical/field";

export type FilterBarThemeClassNameSlot =
  | "itemsRoot"
  | "emptyState"
  | "rowRoot"
  | "row"
  | "rowField"
  | "rowFieldText"
  | "rowOperatorTrigger"
  | "rowOperatorText"
  | "rowValue"
  | "rowError"
  | "rowRemoveButton"
  | "triggerMenuContent"
  | "triggerMenuSeparator"
  | "triggerGroupLabel"
  | "triggerFieldItem"
  | "triggerSubmenuTrigger"
  | "triggerSubmenuContent"
  | "triggerEmptyItem"
  | "viewsRoot"
  | "viewsList"
  | "viewsButton"
  | "viewsButtonActive"
  | "viewsOverflowTrigger"
  | "viewsMenuContent"
  | "viewsEmptyItem"
  | "viewsItem"
  | "saveViewContent"
  | "saveViewForm"
  | "saveViewInput"
  | "saveViewSubmit"
  | "selectTrigger"
  | "selectContent"
  | "selectItem"
  | "selectSearchInput"
  | "selectSeparator"
  | "editorRoot"
  | "editorFieldset"
  | "editorControl"
  | "editorSplit"
  | "booleanTrueButton"
  | "booleanFalseButton";

export interface FilterBarThemeTexts {
  emptyState: string;
  searchFieldsPlaceholder: string;
  searchOptionsPlaceholder: string;
  loadingOptions: string;
  failedToLoadOptions: string;
  noOptions: string;
  noMatchingFields: string;
  noSavedViews: string;
  viewsTriggerFallback: string;
  moreViews: string;
  saveViewTriggerFallback: string;
  exitView: string;
  saveViewNamePlaceholder: string;
  saveViewSubmit: string;
  booleanTrueFallback: string;
  booleanFalseFallback: string;
  removeLabelFallback: string;
}

export interface FilterBarThemeIcons {
  remove?: ReactNode;
  fieldKinds?: Partial<Record<EnumFieldKind, ReactNode>>;
}

export interface FilterBarTheme {
  unstyledPrimitives: boolean;
  classNames: Partial<Record<FilterBarThemeClassNameSlot, string>>;
  texts: FilterBarThemeTexts;
  icons: FilterBarThemeIcons;
}

export type FilterBarThemeInput = Partial<
  Omit<FilterBarTheme, "texts" | "icons" | "classNames">
> & {
  classNames?: Partial<Record<FilterBarThemeClassNameSlot, string>>;
  texts?: Partial<FilterBarThemeTexts>;
  icons?: Partial<FilterBarThemeIcons> & {
    fieldKinds?: Partial<Record<EnumFieldKind, ReactNode>>;
  };
};

const defaultTexts: FilterBarThemeTexts = {
  emptyState: "Add a filter to start building conditions.",
  searchFieldsPlaceholder: "Search fields...",
  searchOptionsPlaceholder: "Search options...",
  loadingOptions: "Loading options...",
  failedToLoadOptions: "Failed to load options",
  noOptions: "No options",
  noMatchingFields: "No matching fields",
  noSavedViews: "No saved views",
  viewsTriggerFallback: "Views",
  moreViews: "More",
  saveViewTriggerFallback: "Save View",
  exitView: "Exit view",
  saveViewNamePlaceholder: "Enter a view name",
  saveViewSubmit: "Save",
  booleanTrueFallback: "True",
  booleanFalseFallback: "False",
  removeLabelFallback: "Remove",
};

export const headlessFilterBarTheme: FilterBarTheme = {
  unstyledPrimitives: true,
  classNames: {},
  texts: defaultTexts,
  icons: {
    fieldKinds: {},
  },
};

export function mergeFilterBarTheme(
  baseTheme: FilterBarTheme,
  overrideTheme?: FilterBarThemeInput | null,
): FilterBarTheme {
  if (!overrideTheme) {
    return baseTheme;
  }

  return {
    unstyledPrimitives:
      overrideTheme.unstyledPrimitives ?? baseTheme.unstyledPrimitives,
    classNames: {
      ...baseTheme.classNames,
      ...overrideTheme.classNames,
    },
    texts: {
      ...baseTheme.texts,
      ...overrideTheme.texts,
    },
    icons: {
      ...baseTheme.icons,
      ...overrideTheme.icons,
      fieldKinds: {
        ...baseTheme.icons.fieldKinds,
        ...overrideTheme.icons?.fieldKinds,
      },
    },
  };
}

export function filterBarThemeSlot(
  ...slots: Array<FilterBarThemeClassNameSlot | null | undefined | false>
) {
  return slots
    .filter((slot): slot is FilterBarThemeClassNameSlot => Boolean(slot))
    .join(" ");
}

const FilterBarThemeContext = createContext<FilterBarTheme>(headlessFilterBarTheme);

export function FilterBarThemeProvider({
  children,
  theme,
}: PropsWithChildren<{
  theme?: FilterBarThemeInput | null | undefined;
}>) {
  const parentTheme = useContext(FilterBarThemeContext);
  const value = useMemo(
    () => mergeFilterBarTheme(parentTheme, theme),
    [parentTheme, theme],
  );

  return (
    <FilterBarThemeContext.Provider value={value}>
      {children}
    </FilterBarThemeContext.Provider>
  );
}

export function useFilterBarTheme() {
  return useContext(FilterBarThemeContext);
}
