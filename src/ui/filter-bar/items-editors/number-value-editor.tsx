import { useEffect, useState } from "react";

import { FieldKind } from "@/logical/field";
import { NumberOperatorKind } from "@/logical/operator";
import { Input } from "@/ui/baseui/input";
import { filterBarThemeSlot, useFilterBarTheme } from "@/ui/filter-bar/theme";

import type { FilterValueEditorProps } from "./shared";

export function NumberValueEditor<FieldId extends string>({
  field,
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.number>) {
  const theme = useFilterBarTheme();
  const [singleDraft, setSingleDraft] = useState(() =>
    typeof item.value === "number" ? String(item.value) : "",
  );
  const [rangeDraft, setRangeDraft] = useState<[string, string]>(() =>
    Array.isArray(item.value)
      ? [
          typeof item.value[0] === "number" ? String(item.value[0]) : "",
          typeof item.value[1] === "number" ? String(item.value[1]) : "",
        ]
      : ["", ""],
  );

  useEffect(() => {
    if (
      item.operator === NumberOperatorKind.between ||
      item.operator === NumberOperatorKind.notBetween
    ) {
      setRangeDraft(
        Array.isArray(item.value)
          ? [
              typeof item.value[0] === "number" ? String(item.value[0]) : "",
              typeof item.value[1] === "number" ? String(item.value[1]) : "",
            ]
          : ["", ""],
      );
      return;
    }

    setSingleDraft(typeof item.value === "number" ? String(item.value) : "");
  }, [item.operator, item.value]);

  function commitSingleDraft(nextDraft: string) {
    setSingleDraft(nextDraft);

    if (!nextDraft) {
      onChange(null);
      return;
    }

    const nextValue = Number(nextDraft);

    if (Number.isFinite(nextValue)) {
      onChange(nextValue);
    }
  }

  function commitRangeDraft(index: 0 | 1, nextDraft: string) {
    setRangeDraft((currentDraft) => {
      const nextRangeDraft = [...currentDraft] as [string, string];
      nextRangeDraft[index] = nextDraft;

      const [startDraft, endDraft] = nextRangeDraft;

      if (!startDraft && !endDraft) {
        onChange(null);
        return nextRangeDraft;
      }

      const startValue = Number(startDraft);
      const endValue = Number(endDraft);

      if (
        startDraft &&
        endDraft &&
        Number.isFinite(startValue) &&
        Number.isFinite(endValue)
      ) {
        onChange([startValue, endValue]);
      } else {
        onChange(null);
      }

      return nextRangeDraft;
    });
  }

  if (
    item.operator === NumberOperatorKind.between ||
    item.operator === NumberOperatorKind.notBetween
  ) {
    return (
      <div
        data-theme-slot={filterBarThemeSlot("editorRoot")}
        className={theme.classNames.editorRoot}
      >
        <div
          data-theme-slot={filterBarThemeSlot("editorSplit")}
          className={theme.classNames.editorSplit}
        >
          <Input
            data-theme-slot={filterBarThemeSlot("editorControl")}
            unstyled={theme.unstyledPrimitives}
            className={theme.classNames.editorControl}
            type="number"
            value={rangeDraft[0]}
            placeholder="Min"
            onChange={(event) => commitRangeDraft(0, event.currentTarget.value)}
          />
          <Input
            data-theme-slot={filterBarThemeSlot("editorControl")}
            unstyled={theme.unstyledPrimitives}
            className={theme.classNames.editorControl}
            type="number"
            value={rangeDraft[1]}
            placeholder="Max"
            onChange={(event) => commitRangeDraft(1, event.currentTarget.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      data-theme-slot={filterBarThemeSlot("editorRoot")}
      className={theme.classNames.editorRoot}
    >
      <Input
        data-theme-slot={filterBarThemeSlot("editorControl")}
        unstyled={theme.unstyledPrimitives}
        className={theme.classNames.editorControl}
        type="number"
        value={singleDraft}
        placeholder={field.placeholder ?? "Enter a number"}
        onChange={(event) => commitSingleDraft(event.currentTarget.value)}
      />
    </div>
  );
}
