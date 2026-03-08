import { type EnumFieldKind } from "@/logical/field";
import { type FilterBarValue, useFilterBar } from "@/filter-bar/context";
import { removeFilterBarValue } from "@/filter-bar/state";
import { filterBarThemeSlot, useFilterBarTheme } from "@/filter-bar/theme";
import { cn } from "@/lib/utils";
import type { UIFieldForKind } from "@/filter-bar/types";

import { FilterItemRow } from "./items.row";

export function FilterItems({
  className,
}: {
  className?: string;
}) {
  const { changeValues, uiFields, values } = useFilterBar();
  const theme = useFilterBarTheme();
  const fieldById = new Map(uiFields.map((field) => [field.id, field] as const));
  const activeItems = values.flatMap((item) => {
    const field = fieldById.get(item.fieldId);

    if (!field) {
      return [];
    }

    return [{ field, item }];
  });

  const updateItem = <FieldId extends string, Kind extends EnumFieldKind>(
    field: UIFieldForKind<FieldId, Kind>,
    updater: (
      current: FilterBarValue<FieldId, Kind>,
    ) => FilterBarValue<FieldId, Kind>,
      meta: {
        completeness: "complete" | "incomplete";
        valueChangeKind?: "typing" | "selected";
        action: "operator" | "value";
      },
  ) => {
    changeValues?.((previous) => {
      const currentIndex = previous.findIndex((value) => value.fieldId === field.id);
      const item = previous[currentIndex];

      if (currentIndex === -1 || item === undefined) {
        return previous;
      }

      const nextValues = [...previous];
      nextValues[currentIndex] = updater(
        item as unknown as FilterBarValue<FieldId, Kind>,
      ) as (typeof previous)[number];
      return nextValues;
    }, meta.action === "value"
      ? {
          action: "value",
          fieldId: field.id,
          completeness: meta.completeness,
          valueChangeKind: meta.valueChangeKind ?? "selected",
        }
      : {
          action: "operator",
          fieldId: field.id,
          completeness: meta.completeness,
        });
  };

  const removeItem = (fieldId: string) => {
    changeValues?.((previous) => removeFilterBarValue(previous, fieldId), {
      action: "remove",
      fieldId,
    });
  };

  if (!activeItems.length) {
    return (
      <div
        data-theme-slot={filterBarThemeSlot("emptyState")}
        className={cn(
          theme.classNames.emptyState,
          className,
        )}
      >
        {theme.texts.emptyState}
      </div>
    );
  }

  return (
    <div
      data-theme-slot={filterBarThemeSlot("itemsRoot")}
      className={cn(theme.classNames.itemsRoot, className)}
    >
      {activeItems.map(({ field, item }) => (
        <FilterItemRow
          key={field.id}
          field={field as never}
          item={item as never}
          onUpdate={(updater, meta) => updateItem(field as never, updater, meta)}
          onRemove={() => removeItem(field.id)}
        />
      ))}
    </div>
  );
}
