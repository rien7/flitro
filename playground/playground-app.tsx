import { useMemo } from "react";
import { FilterBar, filtro } from "../src/ui/index";
import { Button } from "../src/ui/baseui/button"
import { Filter } from "lucide-react";

export function PlaygroundApp() {
  const fields = useMemo(
    () => [
      filtro.string("keyword")
        .meta({ label: "Keyword", placeholder: "Search name or email" }),
      filtro.select("status").meta({ label: "Status" }).options([
        { label: "Open", value: "open" },
        { label: "Closed", value: "closed" },
        { label: "Pending", value: "pending" },
      ]),
      filtro.boolean("archived").meta({ label: "Archived" }),
    ],
    [],
  );

  return (
    <main className="playground">
      <h1>Filtro UI Playground</h1>
      <p className="sub">Use this page to debug src/ui components with HMR.</p>
      <section className="card">
        <FilterBar.Root fields={fields}>
          <FilterBar.Trigger iconMapping render={<Button variant="outline" />}>
            <span className="grid grid-cols-[auto_1fr] gap-1.5 items-center">
              <Filter />
              Filter
            </span>
          </FilterBar.Trigger>
        </FilterBar.Root>
      </section>
    </main>
  );
}
