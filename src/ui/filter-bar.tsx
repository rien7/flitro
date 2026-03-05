import { createContext, type ReactNode } from "react";
import { FieldKind, type EnumFieldKind } from "../logical/field.js";
import type { FieldBuilder } from "./builder.js";
import { getUIFieldFromBuilder } from "./builder.js";
import {
  CalendarIcon,
  CheckSquareIcon,
  HashIcon,
  ListChecksIcon,
  ToggleLeftIcon,
  TypeIcon,
} from "lucide-react";
import type {
  SelectKind,
  SelectOption,
  SelectUIField,
  UIFieldForKind,
} from "./types.js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/ui/baseui/dropdown-menu.js";

export interface FilterBarProps<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind,
> {
  fields: FieldBuilder<FieldId, Kind>[];
  children?: ReactNode;
  defaultIconMapping?: boolean | Partial<Record<EnumFieldKind, ReactNode>>;
}

interface FilterBarContextType<
  FieldId extends string = string,
  Kind extends EnumFieldKind = EnumFieldKind
> {
  uiFields: UIFieldForKind<FieldId, Kind>[]
}

const FilterBarContext = createContext<FilterBarContextType>({
  uiFields: []
})

function isSelectionKind<FieldId extends string, Kind extends EnumFieldKind>(
  field: UIFieldForKind<FieldId, Kind>,
): field is Extract<
  UIFieldForKind<FieldId, Kind>,
  SelectUIField<FieldId, SelectKind>
> {
  return field.kind === FieldKind.select || field.kind === FieldKind.multiSelect
}

const DEFAULT_FIELD_ICON_MAPPING: Record<EnumFieldKind, ReactNode> = {
  [FieldKind.string]: <TypeIcon />,
  [FieldKind.number]: <HashIcon />,
  [FieldKind.date]: <CalendarIcon />,
  [FieldKind.select]: <CheckSquareIcon />,
  [FieldKind.multiSelect]: <ListChecksIcon />,
  [FieldKind.boolean]: <ToggleLeftIcon />,
};

function resolveDefaultIconMapping(
  mapping: boolean | Partial<Record<EnumFieldKind, ReactNode>>,
): Partial<Record<EnumFieldKind, ReactNode>> | null {
  if (mapping === true) {
    return DEFAULT_FIELD_ICON_MAPPING;
  }
  if (mapping && typeof mapping === "object") {
    return mapping;
  }
  return null;
}

function renderFieldIcon<FieldId extends string, Kind extends EnumFieldKind>(
  field: UIFieldForKind<FieldId, Kind>,
  defaultIconMapping: Partial<Record<EnumFieldKind, ReactNode>> | null,
): ReactNode {
  if (field.icon !== undefined) {
    return field.icon;
  }

  if (!defaultIconMapping) return null;
  return defaultIconMapping[field.kind] ?? null;
}

function renderSelectOption(option: SelectOption, keyPath: string): ReactNode {
  const hasChildren = !!option.children?.length;
  if (!hasChildren) {
    return (
      <DropdownMenuItem key={keyPath}>
        {option.prefix}
        {option.label}
      </DropdownMenuItem>
    );
  }

  return (
    <DropdownMenuSub key={keyPath}>
      <DropdownMenuSubTrigger>
        {option.prefix}
        {option.label}
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent>
          {option.children?.map((child, index) =>
            renderSelectOption(child, `${keyPath}.${index}`),
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export function FilterBar<FieldId extends string, Kind extends EnumFieldKind>({
  fields,
  children,
  defaultIconMapping = false,
}: FilterBarProps<FieldId, Kind>) {
  const uiFields = fields.map((field) => getUIFieldFromBuilder(field));
  const resolvedIconMapping = resolveDefaultIconMapping(defaultIconMapping);
  return (
    <FilterBarContext.Provider value={{ uiFields }}>
      {children}
      <DropdownMenu>
        <DropdownMenuTrigger>
          Open
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {uiFields.map((uiField) => {
            return isSelectionKind(uiField) ? (
              <DropdownMenuSub key={uiField.id}>
                <DropdownMenuSubTrigger>
                  {renderFieldIcon(uiField, resolvedIconMapping)}
                  {uiField.label ?? uiField.id}
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    {typeof uiField.options === 'function'
                      ? undefined
                      : uiField.options?.map((option, index) =>
                          renderSelectOption(
                            option,
                            `${String(uiField.id)}.${index}`,
                          ),
                        )}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem key={uiField.id}>
                {renderFieldIcon(uiField, resolvedIconMapping)}
                {uiField.label ?? uiField.id}
              </DropdownMenuItem>
            )
          })}
        </DropdownMenuContent>
      </DropdownMenu>    </FilterBarContext.Provider>
  );
}
