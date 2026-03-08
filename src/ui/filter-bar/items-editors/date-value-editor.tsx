import { useEffect, useState } from "react";

import { FieldKind } from "@/logical/field";
import { DateOperatorKind } from "@/logical/operator";
import { Input } from "@/ui/baseui/input";
import { filterBarThemeSlot, useFilterBarTheme } from "@/ui/filter-bar/theme";

import type { FilterValueEditorProps } from "./shared";

export function DateValueEditor<FieldId extends string>({
  item,
  onChange,
}: FilterValueEditorProps<FieldId, typeof FieldKind.date>) {
  const theme = useFilterBarTheme();
  const [singleDraft, setSingleDraft] = useState(() =>
    typeof item.value === "string" ? item.value : "",
  );
  const [rangeDraft, setRangeDraft] = useState<[string, string]>(() =>
    Array.isArray(item.value)
      ? [
          typeof item.value[0] === "string" ? item.value[0] : "",
          typeof item.value[1] === "string" ? item.value[1] : "",
        ]
      : ["", ""],
  );
  const [relativeDraft, setRelativeDraft] = useState(() =>
    typeof item.value === "number" ? String(item.value) : "",
  );

  useEffect(() => {
    if (
      item.operator === DateOperatorKind.lastNDays ||
      item.operator === DateOperatorKind.nextNDays
    ) {
      setRelativeDraft(typeof item.value === "number" ? String(item.value) : "");
      return;
    }

    if (
      item.operator === DateOperatorKind.between ||
      item.operator === DateOperatorKind.notBetween
    ) {
      setRangeDraft(
        Array.isArray(item.value)
          ? [
              typeof item.value[0] === "string" ? item.value[0] : "",
              typeof item.value[1] === "string" ? item.value[1] : "",
            ]
          : ["", ""],
      );
      return;
    }

    setSingleDraft(typeof item.value === "string" ? item.value : "");
  }, [item.operator, item.value]);

  function commitRelativeDraft(nextDraft: string) {
    setRelativeDraft(nextDraft);

    if (!nextDraft) {
      onChange(null);
      return;
    }

    const nextValue = Number(nextDraft);

    if (Number.isFinite(nextValue)) {
      onChange(Math.max(1, nextValue));
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

      if (startDraft && endDraft) {
        onChange([startDraft, endDraft]);
      } else {
        onChange(null);
      }

      return nextRangeDraft;
    });
  }

  function commitSingleDraft(nextDraft: string) {
    setSingleDraft(nextDraft);
    onChange(nextDraft || null);
  }

  if (
    item.operator === DateOperatorKind.lastNDays ||
    item.operator === DateOperatorKind.nextNDays
  ) {
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
          min="1"
          value={relativeDraft}
          onChange={(event) => commitRelativeDraft(event.currentTarget.value)}
        />
      </div>
    );
  }

  if (
    item.operator === DateOperatorKind.between ||
    item.operator === DateOperatorKind.notBetween
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
            type="date"
            value={rangeDraft[0]}
            onChange={(event) => commitRangeDraft(0, event.currentTarget.value)}
          />
          <Input
            data-theme-slot={filterBarThemeSlot("editorControl")}
            unstyled={theme.unstyledPrimitives}
            className={theme.classNames.editorControl}
            type="date"
            value={rangeDraft[1]}
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
        type="date"
        value={singleDraft}
        onChange={(event) => commitSingleDraft(event.currentTarget.value)}
      />
    </div>
  );
}
