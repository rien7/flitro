import {
  CalendarIcon,
  CheckSquareIcon,
  HashIcon,
  ListChecksIcon,
  ToggleLeftIcon,
  TypeIcon,
  X,
} from "lucide-react";

import { headlessFilterBarTheme, type FilterBarTheme } from "@/filter-bar/theme";
import { cn } from "@/lib/utils";
import { FieldKind } from "@/logical/field";

export * from "./button";
export * from "./button-group";
export * from "./dropdown-menu";
export * from "./input";
export * from "./select";
export * from "./separator";
export * from "./switch";

const suggestionHoverSurfaceClass = cn(
  "transition",
  "group-hover/suggestion:bg-muted",
);

const suggestionDashedBorderClass = cn(
  "data-[area=suggestion]:border-dashed",
  "data-[area=suggestion]:group-hover/suggestion:border-solid",
);

const outlinedSurfaceClass = cn(
  "border border-border bg-background",
  "dark:border-input dark:bg-input/30",
);

const outlinedSurfaceHoverClass = cn(
  "hover:bg-muted hover:text-foreground",
  "dark:hover:bg-input/50",
);

const popupSurfaceClass = cn(
  "filtro-popup-motion",
  "ring-foreground/10 bg-popover text-popover-foreground",
  "rounded-lg p-1 shadow-md ring-1 z-50",
  "max-h-(--available-height)",
  "origin-(--transform-origin) overflow-x-hidden overflow-y-auto outline-none",
  "data-closed:overflow-hidden",
);

const primitiveControlFocusClass = cn(
  "focus-visible:border-ring focus-visible:ring-ring/50",
  "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
  "aria-invalid:border-destructive",
);

const primitiveDisabledClass = "disabled:pointer-events-none disabled:opacity-50";

const primitiveItemBaseClass = cn(
  "gap-1.5 text-sm",
  "relative flex cursor-default items-center rounded-md",
  "outline-hidden select-none",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
  "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  "[&_svg:not([class*='size-'])]:size-4",
);

export const defaultFilterBarTheme: FilterBarTheme = {
  ...headlessFilterBarTheme,
  classNames: {
    contentRoot: "inline-flex flex-row flex-wrap gap-3",
    pinnedItemsRoot: "inline-flex flex-row flex-wrap gap-3",
    suggestedItemsRoot: "inline-flex flex-row flex-wrap gap-3",
    suggestionButton: cn(
      "group/suggestion inline-flex min-h-0 min-w-0 max-w-full justify-start overflow-visible",
      "rounded-md border-0 bg-transparent p-0 font-normal text-foreground shadow-none transition opacity-50 hover:opacity-80",
      "focus-visible:bg-transparent",
    ),
    suggestionAdd: cn(
      "border-border bg-background !border-l border-dashed px-3",
      "font-normal text-muted-foreground [&_svg]:rotate-45",
      suggestionHoverSurfaceClass,
      "group-hover/suggestion:border-solid",
    ),
    activeItemsRoot: "flex flex-row flex-wrap gap-3",
    emptyState:
      "text-muted-foreground flex min-h-24 items-center justify-center rounded-2xl border border-dashed px-4 text-sm",
    rowRoot: "flex min-w-0 flex-col gap-1",
    row: "min-h-9 md:flex-nowrap data-[area=suggestion]:w-full",
    rowField: cn(
      "h-full select-none border-border bg-background border-r-0",
      suggestionHoverSurfaceClass,
      "data-[has-trailing-border=true]:border-r",
      "data-[round-right=true]:rounded-r-md",
      suggestionDashedBorderClass,
    ),
    rowFieldText: "block truncate text-sm font-medium",
    rowOperatorTrigger: cn(
      "h-full w-fit !border-l shadow-none",
      "font-normal text-muted-foreground",
      suggestionHoverSurfaceClass,
      "data-[round-right=true]:rounded-r-md data-[round-right=true]:border-r",
      suggestionDashedBorderClass,
    ),
    rowOperatorText: cn(
      "h-full w-fit select-none whitespace-nowrap bg-background px-3 py-2",
      "font-normal !border-l text-muted-foreground",
      "data-[round-right=true]:rounded-r-md data-[round-right=true]:border-r",
      suggestionDashedBorderClass,
    ),
    rowValue: cn(
      "flex min-w-0 grow overflow-visible border border-border bg-background border-r-0",
      suggestionHoverSurfaceClass,
      "data-[round-right=true]:border-r data-[round-right=true]:rounded-r-md",
      "data-[area=pinned]:overflow-hidden data-[area=pinned]:border-r data-[area=pinned]:rounded-r-md",
      suggestionDashedBorderClass,
    ),
    rowRemoveButton: cn(
      "h-full min-h-0 !border-l px-2.5 text-foreground",
      outlinedSurfaceClass,
      suggestionHoverSurfaceClass,
      "hover:bg-destructive/20 hover:border-destructive/30 hover:text-destructive",
      "focus-visible:border-destructive/40",
    ),
    triggerMenuContent: "min-w-48",
    viewsRoot: "relative flex w-full flex-wrap items-start gap-2",
    viewsList: "flex flex-wrap gap-2",
    viewsButton: cn(
      "h-7 max-w-48 truncate rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem]",
      outlinedSurfaceClass,
      "text-muted-foreground",
      outlinedSurfaceHoverClass,
      "aria-expanded:bg-muted aria-expanded:text-foreground",
      "data-[active=true]:border-primary/30 data-[active=true]:bg-primary",
      "data-[active=true]:text-primary-foreground",
      "data-[active=true]:hover:bg-primary/90 data-[active=true]:hover:text-primary-foreground",
    ),
    viewsButtonActive: "",
    viewsOverflowTrigger: "border-dashed",
    viewsMenuContent: "min-w-48",
    viewsItem: "justify-between",
    saveViewContent: "min-w-64 p-2",
    saveViewForm: "flex flex-col gap-2",
    saveViewInput: "w-full",
    saveViewSubmit: cn(
      "h-8 w-full justify-center px-2.5",
      outlinedSurfaceClass,
      outlinedSurfaceHoverClass,
    ),
    editorRoot: "flex w-full min-w-0 flex-col justify-center",
    editorFieldset: "flex min-h-9 w-full min-w-0 items-stretch",
    editorControl: cn(
      "h-full min-h-0 w-full rounded-none border-0 px-3 py-0 shadow-none",
      "hover:bg-muted focus-visible:ring-0",
      suggestionHoverSurfaceClass,
    ),
    editorSplit:
      "grid min-h-9 min-w-0 w-full grid-cols-2 items-stretch [&>*]:h-full [&>*+*]:border-l",
    rowError: "px-3 py-1 text-[11px] leading-4 text-destructive",
    booleanTrueButton: cn(
      "h-full min-h-0 w-full justify-center rounded-none border-0 bg-transparent shadow-none",
      "hover:bg-muted dark:hover:bg-muted/50",
      "aria-pressed:bg-secondary aria-pressed:text-secondary-foreground",
      "aria-pressed:hover:bg-secondary/80",
    ),
    booleanFalseButton: cn(
      "h-full min-h-0 w-full justify-center rounded-none border-0 border-l bg-transparent shadow-none",
      "hover:bg-muted dark:hover:bg-muted/50",
      "aria-pressed:bg-secondary aria-pressed:text-secondary-foreground",
      "aria-pressed:hover:bg-secondary/80",
    ),
  },
  primitiveClassNames: {
    button: cn(
      primitiveControlFocusClass,
      "dark:aria-invalid:border-destructive/50",
      "rounded-lg border border-transparent bg-clip-padding",
      "text-sm font-medium focus-visible:ring-3 aria-invalid:ring-3",
      "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap",
      "transition-[color,box-shadow] outline-none select-none",
      primitiveDisabledClass,
      "[&_svg]:pointer-events-none [&_svg]:shrink-0",
      "[&_svg:not([class*='size-'])]:size-4",
    ),
    input: cn(
      primitiveControlFocusClass,
      "border-input text-foreground placeholder:text-muted-foreground",
      "flex h-9 w-full min-w-0 rounded-lg border px-3 py-1 text-sm",
      "shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-3",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ),
    selectPositioner: "isolate z-50 outline-none",
    selectTrigger: cn(
      primitiveControlFocusClass,
      "border-input bg-background text-foreground placeholder:text-muted-foreground",
      "inline-flex h-9 w-full items-center justify-between gap-2",
      "rounded-lg border px-3 py-2 text-sm",
      "shadow-xs outline-none transition-[color,box-shadow] focus-visible:ring-3",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "data-[popup-open]:border-ring",
    ),
    selectTriggerText: "truncate",
    selectIcon: "text-muted-foreground shrink-0",
    selectContent: cn(
      popupSurfaceClass,
      "min-w-[var(--anchor-width)]",
    ),
    selectItem: cn(
      primitiveItemBaseClass,
      "focus:bg-accent focus:text-accent-foreground",
      "data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground",
      "py-1 pr-8 pl-1.5",
    ),
    selectItemIndicator: "absolute right-2 flex size-4 items-center justify-center",
    selectSearchInput: "h-8 border-0 bg-transparent px-1.5 shadow-none focus:ring-0 focus-visible:ring-0",
    selectSeparator: "bg-border -mx-1 my-1 h-px",
    dropdownMenuPositioner: "isolate z-50 outline-none",
    dropdownMenuContent: cn(
      popupSurfaceClass,
      "min-w-32 w-(--anchor-width)",
    ),
    dropdownMenuLabel: cn(
      "text-muted-foreground px-1.5 py-1 text-xs font-medium",
    ),
    dropdownMenuItem: cn(
      primitiveItemBaseClass,
      "group/dropdown-menu-item",
      "focus:bg-accent focus:text-accent-foreground",
      "px-1.5 py-1",
    ),
    dropdownMenuSubTrigger: cn(
      primitiveItemBaseClass,
      "focus:bg-accent focus:text-accent-foreground",
      "data-open:bg-accent data-open:text-accent-foreground",
      "data-popup-open:bg-accent data-popup-open:text-accent-foreground",
      "px-1.5 py-1",
    ),
    dropdownMenuSubmenuIndicator: "cn-rtl-flip ml-auto",
    dropdownMenuSubContent: cn(
      "min-w-[96px] w-auto rounded-lg shadow-lg",
    ),
    dropdownMenuCheckboxItem: cn(
      primitiveItemBaseClass,
      "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground",
      "py-1 pr-8 pl-1.5",
    ),
    dropdownMenuCheckboxItemIndicator:
      "absolute right-2 flex items-center justify-center pointer-events-none",
    dropdownMenuRadioItem: cn(
      primitiveItemBaseClass,
      "focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground",
      "py-1 pr-8 pl-1.5",
    ),
    dropdownMenuRadioItemIndicator:
      "absolute right-2 flex items-center justify-center pointer-events-none",
    dropdownMenuSeparator: "bg-border -mx-1 my-1 h-px",
    separator:
      "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
    switch: cn(
      "bg-input data-[checked]:bg-primary",
      "inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent",
      "shadow-xs outline-none transition-colors",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
      "disabled:cursor-not-allowed disabled:opacity-50",
    ),
    switchThumb: cn(
      "bg-background pointer-events-none block size-5 rounded-full shadow-sm",
      "transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
    ),
    buttonGroup: cn(
      "flex w-fit items-stretch",
      "has-[>[data-slot=button-group]]:gap-2",
      "has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg",
      "*:focus-visible:relative *:focus-visible:z-10",
      "[&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
      "data-[orientation=horizontal]:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-r-lg!",
      "data-[orientation=horizontal]:*:data-slot:rounded-r-none",
      "data-[orientation=horizontal]:[&>[data-slot]~[data-slot]]:rounded-l-none",
      "data-[orientation=horizontal]:[&>[data-slot]~[data-slot]]:border-l-0",
      "data-[orientation=vertical]:flex-col",
      "data-[orientation=vertical]:[&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg!",
      "data-[orientation=vertical]:*:data-slot:rounded-b-none",
      "data-[orientation=vertical]:[&>[data-slot]~[data-slot]]:rounded-t-none",
      "data-[orientation=vertical]:[&>[data-slot]~[data-slot]]:border-t-0",
    ),
    buttonGroupText: cn(
      "flex items-center gap-2 rounded-lg border bg-muted px-2.5",
      "text-sm font-medium",
      "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
    ),
    buttonGroupSeparator:
      "bg-input relative self-stretch data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
  },
  icons: {
    remove: <X className="size-4" />,
    fieldKinds: {
      [FieldKind.string]: <TypeIcon />,
      [FieldKind.number]: <HashIcon />,
      [FieldKind.date]: <CalendarIcon />,
      [FieldKind.select]: <CheckSquareIcon />,
      [FieldKind.multiSelect]: <ListChecksIcon />,
      [FieldKind.boolean]: <ToggleLeftIcon />,
    },
  },
};
