# Executive Sales Brief

**Live Demo:** [https://executive-sales-brief.vercel.app/](https://executive-sales-brief.vercel.app/)

An executive decision support tool. Transform a raw sales CSV into an executive-ready business performance report in seconds.

## What it does

Upload a sales CSV (or load the bundled demo dataset) and the app will:

- Parse and validate the file, normalizing column names so it isn't locked to one specific export format
- Generate an **Executive Brief**: a short set of plain-language findings (revenue concentration, margin trends, discount impact, and more) written from the data by a deterministic rule engine
- Generate **Recommended Actions**: prioritized, actionable recommendations (High/Medium/Low) such as reviewing pricing, adjusting discount strategy, or focusing on high-margin categories
- Calculate core KPIs: revenue, profit, margin, average order value, orders, units sold, and top/bottom performers by product, category, and region
- Render five performance-trend charts covering revenue trends, regional performance, category profitability, and top products
- Degrade gracefully when a dataset is missing optional data. If there's no Profit column, Sales can be derived from unit price and quantity, and every profit-dependent KPI, chart, insight, or recommendation shows a clear message instead of fabricated numbers. If there's no date column, monthly trend charts do the same.

Executive findings and recommendations are generated using a deterministic business rules engine, ensuring consistent, explainable, and reproducible results without relying on AI models.

## Tech stack

- React 19, TypeScript, Vite
- Tailwind CSS v4 with shadcn/ui components
- Recharts for visualizations
- PapaParse for CSV parsing
- Zustand for state

## Getting started

```
npm install
npm run dev
```

Open the printed local URL (typically `http://localhost:5173`) in a browser.

Other scripts:

```
npm run build     # type-check and build for production
npm run preview   # serve the production build locally
npm run lint      # run oxlint
```

## CSV format

The parser looks for columns by name (case-insensitive, underscores and hyphens are normalized to spaces) and accepts common aliases:

| Field | Required | Recognized column names |
|---|---|---|
| Sales | Yes* | `sales`, `revenue`, `amount` |
| Profit | No | `profit` |
| Quantity | No | `quantity`, `qty`, `units`, `units sold` |
| Unit Price | No | `unit price`, `price unit`, `price` |
| Category | No | `category` |
| Sub-Category | No | `sub-category`, `subcategory` |
| Product | No | `product name`, `product`, `item`, `sku` |
| Region | No | `region` |
| Order Date | No | `order date`, `date` |
| Discount | No | `discount` |

\* If there's no Sales/Revenue column, it's calculated from Unit Price × Quantity when both are present.

Everything else in the file is ignored. There's no dependency on any one dataset's exact schema.

## Dashboard layout

The dashboard renders in this order, so the narrative comes first and the supporting data follows:

1. **Executive Brief** — generated findings about the loaded dataset
2. **Recommended Actions** — prioritized, actionable recommendations
3. **Business Performance Overview** — core KPI cards
4. **Top & Bottom Performers** — leading and lagging product, category, and region
5. **Performance Trends** — the five charts

## Project structure

```
src/
  components/
    charts/     Recharts visualizations, each wrapped in a shared ChartCard
    kpi/        KPI cards and grid layout
    layout/     App shell, top bar, dashboard composition
    states/     Empty, loading, and error screens
    summary/    Executive Brief and Recommended Actions sections
    upload/     File upload and demo dataset picker
    ui/         shadcn/ui primitives
  lib/
    analysis/   KPI calculations, aggregations, insights, and recommendation engines
    csv/        Parsing, schema, and column-mapping logic
    utils/      Formatters and shared helpers
  store/        Zustand dataset store
  types/        Shared TypeScript types
public/
  sample-data/  Bundled demo CSV (Superstore sample)
```

## Why this project?

Business leaders often receive large CSV exports that require manual analysis before meaningful decisions can be made. Executive Sales Brief reduces this effort by automatically converting raw sales data into business metrics, executive findings, and actionable recommendations.

## Notes

- `lib/analysis/insights.ts` and `lib/analysis/recommendations.ts` contain the rule engines behind the Executive Brief and Recommended Actions sections. Both are pure functions of the loaded rows, no hardcoded text.
