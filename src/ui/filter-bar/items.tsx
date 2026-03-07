import { type EnumFieldKind } from "@/logical/field";
import {
  type FilterBarValue,
  type FilterBarValueType,
  useFilterBar,
} from "@/ui/filter-bar/context";
import { cn } from "@/ui/lib/utils";
import type { UIFieldForKind } from "@/ui/types";

import { FilterItemRow } from "./items.row";

export function FilterItems({
  className,
}: {
  className?: string;
}) {
  const { uiFields, values, setValues } = useFilterBar();
  const activeFields = uiFields.filter((field) => values[field.id] !== undefined);

  const updateItem = <FieldId extends string, Kind extends EnumFieldKind>(
    field: UIFieldForKind<FieldId, Kind>,
    updater: (
      current: FilterBarValue<FieldId, Kind>,
    ) => FilterBarValue<FieldId, Kind>,
  ) => {
    setValues?.((previous) => {
      const current = previous[field.id] as FilterBarValue<FieldId, Kind> | undefined;
      if (!current) return previous;

      return {
        ...previous,
        [field.id]: updater(current),
      } as FilterBarValueType;
    });
  };

  const removeItem = (fieldId: string) => {
    setValues?.((previous) => {
      const nextValues = { ...previous };
      delete nextValues[fieldId];
      return nextValues;
    });
  };

  if (!activeFields.length) {
    return (
      <div
        className={cn(
          "text-muted-foreground flex min-h-24 items-center justify-center rounded-2xl border border-dashed px-4 text-sm",
          className,
        )}
      >
        Add a filter to start building conditions.
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {activeFields.map((field) => {
        const item = values[field.id];

        if (!item) return null;

        return (
          <FilterItemRow
            key={field.id}
            field={field}
            item={item as never}
            onUpdate={(updater) => updateItem(field, updater)}
            onRemove={() => removeItem(field.id)}
          />
        );
      })}
    </div>
  );
}
