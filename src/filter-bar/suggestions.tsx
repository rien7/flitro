import { FieldKind } from "@/logical/field";
import { useFilterBar } from "@/filter-bar/context";
import {
  resolveSuggestionFields,
} from "@/filter-bar/display";
import { Button } from "@/filter-bar/internal/primitives/baseui/button";
import { OPERATOR_LABELS } from "@/filter-bar/items.constants";
import { getSuggestedDisplay } from "@/filter-bar/placement";
import { createFilterBarValue, getFilterBarValueCompleteness, upsertFilterBarValue } from "@/filter-bar/state";
import { filterBarThemeSlot, useFilterBarTheme } from "@/filter-bar/theme";
import type { FilterBarValue } from "@/filter-bar/context";
import type { EnumFieldKind } from "@/logical/field";
import { cn } from "@/lib/utils";
import { sanitizeFilterBarValue } from "@/filter-bar/value";
import type { BooleanUIField } from "@/filter-bar/types";

function getSuggestionValuePreview(
  value: FilterBarValue<string, EnumFieldKind>,
  options: {
    booleanOptions?: BooleanUIField["options"];
  },
  texts: {
    booleanTrueFallback: string;
    booleanFalseFallback: string;
  },
) {
  switch (value.kind) {
    case FieldKind.string:
    case FieldKind.select:
    case FieldKind.date:
      return typeof value.value === "string" && value.value.length > 0 ? value.value : null;
    case FieldKind.number:
      if (Array.isArray(value.value)) {
        return value.value.every((entry) => typeof entry === "number")
          ? value.value.join(" - ")
          : null;
      }
      return typeof value.value === "number" ? String(value.value) : null;
    case FieldKind.multiSelect:
      return Array.isArray(value.value) && value.value.length > 0
        ? value.value.join(", ")
        : null;
    case FieldKind.boolean:
      if (typeof value.value !== "boolean") {
        return null;
      }

      return options.booleanOptions?.find((option) => option.value === value.value)?.label
        ?? (value.value ? texts.booleanTrueFallback : texts.booleanFalseFallback);
    default:
      return null;
  }
}

export function FilterBarSuggestedItems({
  className,
}: {
  className?: string;
}) {
  const {
    changeDismissedSuggestionFieldIds,
    changeDraftValues,
    changeValues,
    clearActiveView,
    dismissedSuggestionFieldIds,
    draftValues,
    uiFields,
    values,
  } = useFilterBar();
  const theme = useFilterBarTheme();
  const fields = resolveSuggestionFields(
    uiFields,
    values,
    draftValues,
    dismissedSuggestionFieldIds,
  );

  if (!fields.length) {
    return null;
  }

  return (
    <div
      data-theme-slot={filterBarThemeSlot("suggestedItemsRoot")}
      className={cn(theme.classNames.suggestedItemsRoot, className)}
    >
      {fields.map((field) => {
        const suggestion = getSuggestedDisplay(field);
        const nextValue = createFilterBarValue(field as never, suggestion?.seed as never);
        const booleanOptions = field.kind === FieldKind.boolean ? field.options : undefined;
        const valuePreview = nextValue
          ? getSuggestionValuePreview(
            nextValue as FilterBarValue<string, EnumFieldKind>,
            { booleanOptions },
            theme.texts,
          )
          : null;

        return (
          <Button
            key={field.id}
            data-theme-slot={filterBarThemeSlot("suggestionButton")}
            data-area="suggestion"
            unstyled={theme.unstyledPrimitives}
            type="button"
            variant="outline"
            className={theme.classNames.suggestionButton}
            onClick={() => {
              if (!nextValue) {
                return;
              }

              const activeValue = sanitizeFilterBarValue(field as never, nextValue as never);

              clearActiveView?.();
              changeDismissedSuggestionFieldIds?.((previous) =>
                previous.filter((fieldId) => fieldId !== field.id),
              );

              if (!activeValue) {
                changeDraftValues?.((previous) =>
                  upsertFilterBarValue(previous, nextValue as never),
                );
                return;
              }

              changeDraftValues?.((previous) =>
                previous.filter((entry) => entry.fieldId !== field.id),
              );
              changeValues?.(
                (previous) => upsertFilterBarValue(previous, activeValue as never),
                {
                  action: "add",
                  fieldId: field.id,
                  completeness: getFilterBarValueCompleteness(activeValue as never),
                },
              );
            }}
          >
            <span data-suggestion-segment="field">
              {field.label ?? field.id}
            </span>
            {nextValue ? (
              <span data-suggestion-segment="operator">
                {OPERATOR_LABELS[nextValue.operator] ?? nextValue.operator}
              </span>
            ) : null}
            <span data-suggestion-segment="value">
              {valuePreview ?? field.placeholder ?? "Set value"}
            </span>
            <span data-suggestion-add aria-hidden="true">
              {theme.icons.remove ?? theme.texts.removeLabelFallback}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
