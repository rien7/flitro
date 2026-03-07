import { type EnumFieldKind } from "@/logical/field";
import { type OperatorKindFor } from "@/logical/operator";
import { Button } from "@/ui/baseui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/ui/baseui/button-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/baseui/select";
import type { FilterBarValue } from "@/ui/filter-bar/context";
import { isEmptyOperator, normalizeValueForOperator } from "@/ui/filter-bar/state";
import type { UIFieldForKind } from "@/ui/types";
import { X } from "lucide-react";

import { OPERATOR_LABELS } from "./items.constants";
import { FilterValueEditor } from "./items.value-editor";

export function FilterItemRow<FieldId extends string, Kind extends EnumFieldKind>({
  field,
  item,
  onUpdate,
  onRemove,
}: {
  field: UIFieldForKind<FieldId, Kind>;
  item: FilterBarValue<FieldId, Kind>;
  onUpdate: (updater: (current: FilterBarValue<FieldId, Kind>) => FilterBarValue<FieldId, Kind>) => void;
  onRemove: () => void;
}) {
  return (
    <ButtonGroup className="md:flex-nowrap">
      <ButtonGroupText className="bg-background">
        <span className="block truncate text-sm font-medium">
          {field.label ?? field.id}
        </span>
      </ButtonGroupText>

      <Select<string>
        value={item.operator}
        onValueChange={(nextOperator) =>
          onUpdate((current) => ({
            ...current,
            operator: nextOperator as typeof current.operator,
            allowOperators: [...field.allowedOperators] as typeof current.allowOperators,
            value: normalizeValueForOperator({
              field,
              operator: nextOperator as OperatorKindFor<typeof field.kind>,
              previousValue: current.value as never,
            }) as typeof current.value,
          }))
        }
      >
        <SelectTrigger
          className="h-full w-fit shadow-none font-normal text-muted-foreground"
          render={<Button variant="outline" />}
        >
          <SelectValue>
            {(value) => OPERATOR_LABELS[String(value)] ?? String(value ?? "")}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {field.allowedOperators.map((operator) => (
            <SelectItem key={operator} value={operator}>
              {OPERATOR_LABELS[operator] ?? operator}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {isEmptyOperator(item.operator) ? null : (
        <>
          <ButtonGroupSeparator className="hidden md:block" />

          <div data-slot="button-group-text" className="min-w-0 grow border border-border">
            <FilterValueEditor
              field={field}
              item={item}
              onChange={(value) =>
                onUpdate((current) => ({
                  ...current,
                  value,
                }))
              }
            />
          </div>

          <ButtonGroupSeparator className="hidden md:block" />
        </>
      )}

      <Button
        variant="outline"
        aria-label={`Remove ${field.label ?? field.id} filter`}
        onClick={onRemove}
        className="h-auto"
      >
        <X className="size-4" />
      </Button>
    </ButtonGroup>
  );
}
