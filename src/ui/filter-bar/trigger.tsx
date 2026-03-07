import type { ReactNode } from "react";
import { FieldKind, type EnumFieldKind } from "@/logical/field";
import {
  EmptyOperatorKind,
  MultiSelectOperatorKind,
  SelectOperatorKind,
} from "@/logical/operator";
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
  UIFieldBase,
  SelectUIField,
  UIFieldForKind,
} from "@/ui/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/ui/baseui/dropdown-menu";
import type { MenuTrigger } from "@base-ui/react";
import { type FilterBarValueType, useFilterBar } from "@/ui/filter-bar/context";

function isSelectionKind<FieldId extends string, Kind extends EnumFieldKind>(
  field: UIFieldForKind<FieldId, Kind>,
): field is Extract<
  UIFieldForKind<FieldId, Kind>,
  SelectUIField<FieldId, SelectKind>
> {
  return field.kind === FieldKind.select || field.kind === FieldKind.multiSelect
}

function createInitialFilterValue<
  FieldId extends string,
  Kind extends Exclude<EnumFieldKind, SelectKind>,
>(
  field: UIFieldBase<FieldId, Kind>,
): FilterBarValueType<FieldId, Kind>[FieldId] | null;
function createInitialFilterValue<
  FieldId extends string,
  Kind extends SelectKind,
>(
  field: SelectUIField<FieldId, Kind>,
  selectedValue: string,
): FilterBarValueType<FieldId, Kind>[FieldId] | null;
function createInitialFilterValue<
  FieldId extends string,
  Kind extends EnumFieldKind,
>(
  field: UIFieldBase<FieldId, Kind>,
  selectedValue?: string,
) {
  const operator = field.allowedOperators[0];

  if (operator === undefined) {
    return null;
  }

  const value =
    field.kind === FieldKind.select
      ? operator === SelectOperatorKind.in || operator === SelectOperatorKind.notIn
        ? [selectedValue]
        : operator === SelectOperatorKind.eq || operator === SelectOperatorKind.neq
          ? selectedValue
          : null
      : field.kind === FieldKind.multiSelect
        ? operator === MultiSelectOperatorKind.hasAny
          || operator === MultiSelectOperatorKind.hasAll
          || operator === MultiSelectOperatorKind.hasNone
          ? [selectedValue]
          : null
        : operator === EmptyOperatorKind.isEmpty || operator === EmptyOperatorKind.isNotEmpty
          ? null
          : null;

  return {
    field: field.id,
    kind: field.kind,
    operator,
    allowOperators: [...field.allowedOperators],
    value,
  } as FilterBarValueType<FieldId, Kind>[FieldId];
}

const DEFAULT_FIELD_ICON_MAPPING: Record<EnumFieldKind, ReactNode> = {
  [FieldKind.string]: <TypeIcon />,
  [FieldKind.number]: <HashIcon />,
  [FieldKind.date]: <CalendarIcon />,
  [FieldKind.select]: <CheckSquareIcon />,
  [FieldKind.multiSelect]: <ListChecksIcon />,
  [FieldKind.boolean]: <ToggleLeftIcon />,
};

function resolveIconMapping(
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

function renderSelectOption<FieldId extends string, Kind extends SelectKind>({
  field,
  option,
  keyPath,
  onSelect,
}: {
  field: SelectUIField<FieldId, Kind>;
  option: SelectOption;
  keyPath: string;
  onSelect: (field: SelectUIField<FieldId, Kind>, value: string) => void;
}): ReactNode {
  const hasChildren = !!option.children?.length;
  if (!hasChildren) {
    return (
      <DropdownMenuItem key={keyPath} onClick={() => onSelect(field, option.value)}>
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
            renderSelectOption({
              field,
              option: child,
              keyPath: `${keyPath}.${index}`,
              onSelect,
            }),
          )}
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}

export function FilterBarTrigger({
  iconMapping = false,
  children,
  ...props
}: MenuTrigger.Props & {
  iconMapping: Partial<Record<EnumFieldKind, ReactNode>> | boolean
}) {
  const { uiFields, values, setValues } = useFilterBar()
  const resolvedIconMapping = resolveIconMapping(iconMapping);
  const handleSelectField = <FieldId extends string, Kind extends SelectKind>(
    field: SelectUIField<FieldId, Kind>,
    value: string,
  ) => {
    const nextValue = createInitialFilterValue(field, value);

    if (!nextValue) {
      return;
    }

    setValues?.((prev) => ({
      ...prev,
      [field.id]: nextValue,
    } as FilterBarValueType))
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger {...props}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {uiFields.filter(uiField => values[uiField.id] === undefined).map((uiField) => {
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
                      renderSelectOption({
                        field: uiField,
                        option,
                        keyPath: `${String(uiField.id)}.${index}`,
                        onSelect: handleSelectField,
                      }),
                    )}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem key={uiField.id} onClick={() => {
              const nextValue = createInitialFilterValue(uiField);

              if (!nextValue) {
                return;
              }

              setValues?.((prev) => ({
                ...prev,
                [uiField.id]: nextValue,
              } as FilterBarValueType))
            }}>
              {renderFieldIcon(uiField, resolvedIconMapping)}
              {uiField.label ?? uiField.id}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
