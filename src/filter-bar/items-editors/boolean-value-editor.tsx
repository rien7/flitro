import { FieldKind } from "@/logical/field";
import { Button } from "@/filter-bar/internal/primitives/baseui/button";
import { filterBarThemeSlot, useFilterBarTheme } from "@/filter-bar/theme";

import type { FilterValueEditorProps } from "./shared";

export function BooleanValueEditor<FieldId extends string>({
  field,
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.boolean>) {
  const theme = useFilterBarTheme();

  return (
    <div
      data-theme-slot={filterBarThemeSlot("editorRoot")}
      className={theme.classNames.editorRoot}
    >
      <div
        data-theme-slot={filterBarThemeSlot("editorSplit")}
        className={theme.classNames.editorSplit}
      >
        <Button
          data-theme-slot={filterBarThemeSlot("booleanTrueButton")}
          type="button"
          className={theme.classNames.booleanTrueButton}
          aria-pressed={item.value === true}
          onClick={() => onChange(true, { valueChangeKind: "selected" })}
        >
          {field.options?.[0].label ?? theme.texts.booleanTrueFallback}
        </Button>
        <Button
          data-theme-slot={filterBarThemeSlot("booleanFalseButton")}
          type="button"
          className={theme.classNames.booleanFalseButton}
          aria-pressed={item.value === false}
          onClick={() => onChange(false, { valueChangeKind: "selected" })}
        >
          {field.options?.[1].label ?? theme.texts.booleanFalseFallback}
        </Button>
      </div>
    </div>
  );
}
