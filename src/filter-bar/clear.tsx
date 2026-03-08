import type { ComponentProps } from "react";

import { Button } from "@/filter-bar/internal/primitives/baseui/button";
import { useFilterBar } from "@/filter-bar/context";

export function FilterBarClear({ children, ...props }: ComponentProps<typeof Button>) {
  const { changeValues, clearActiveView } = useFilterBar()
  const handleButtonClick = () => {
    clearActiveView?.()
    changeValues?.([], { action: "clear" })
  }
  return (
    <Button {...props} onClick={handleButtonClick}>
      {children}
    </Button>
  )
}
