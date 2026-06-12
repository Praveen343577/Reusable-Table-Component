# Reusable Table Component

A **production-grade**, fully modular React data-table library built with **Vite + React 19**. Designed for real-time dashboards, fleet management systems, and any data-heavy application that needs a polished, feature-rich table out of the box.

---

## ✨ Features

| Category | Highlights |
|---|---|
| **Core Table** | Column definitions with custom renderers, fixed-layout columns, sticky headers |
| **Search** | Global full-text search across all row fields |
| **Filtering** | Multi-column filtering with exact-match and range-based modes, per-column search |
| **Sorting** | Click-to-sort with ascending/descending toggle, sort indicator icons |
| **Pagination** | Configurable rows-per-page (10/25/50), page jump, ellipsis navigation |
| **Row Selection** | Checkbox-based single & select-all support |
| **Column Toggle** | Show/hide columns at runtime via dropdown |
| **Export** | One-click Excel (.xlsx) export with styled headers via `xlsx-js-style` |
| **Tabs** | Built-in tab bar for data segmentation (e.g., All / Active / Inactive) |
| **Virtualization** | Row virtualization via `@tanstack/react-virtual` for large datasets |
| **Real-time Data** | `DeltaPill` component + `useWebSocket` hook for live metric deltas |
| **i18n** | Full internationalization support via `react-i18next` |
| **Locale Text** | Override all UI strings via the `localeText` prop |
| **Server Mode** | Dedicated `mode="server"` with external pagination, sort, and filter callbacks |
| **Responsive** | Four breakpoints (72rem → 48rem) with progressive scaling |
| **CSS Modules** | Fully scoped styles — zero conflicts when embedded in host apps |
| **Dark Mode** | CSS-variable-driven dark theme via `body.dark` class |

---

## 📦 Tech Stack

| Dependency | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 8** | Build tool & dev server |
| **@tanstack/react-virtual** | Row virtualization for large datasets |
| **lucide-react** | Icon library (Search, Filter, Columns, etc.) |
| **xlsx-js-style** | Styled Excel export |
| **i18next + react-i18next** | Internationalization |
| **prop-types** | Runtime type checking |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9

### Installation

```bash
git clone <repository-url>
cd reusable-table-component
npm install
```

### Development

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. The demo app loads 200 mock vehicle records with simulated live WebSocket updates every 3 seconds.

### Production Build

```bash
npm run build
npm run preview
```

---

## 🗂️ Project Structure

```
src/
├── Components/
│   ├── DeltaPill/
│   │   ├── DeltaPill.jsx          # Live change indicator pill (↑/↓/~)
│   │   └── DeltaPill.module.css   # DeltaPill styles + responsive breakpoints
│   └── Table/
│       ├── Body/
│       │   └── Body.jsx           # Virtualized table body with BodyRow
│       ├── Header/
│       │   ├── Header.jsx         # Sticky header with sort indicators
│       │   └── Header.module.css
│       ├── Pagination/
│       │   ├── Pagination.jsx     # Footer with page nav, rows-per-page, go-to
│       │   └── Pagination.module.css
│       ├── Toolbar/
│       │   ├── Toolbar.jsx        # Tab bar + action slot container
│       │   ├── Search.jsx         # Search input with icon
│       │   ├── Filter.jsx         # Multi-column filter dropdown
│       │   ├── ColumnToggle.jsx   # Show/hide columns dropdown
│       │   ├── Export.jsx         # Excel export button
│       │   ├── Refresh.jsx        # Reset-all button
│       │   ├── Toolbar.module.css
│       │   ├── Search.module.css
│       │   └── Filter.module.css
│       ├── hooks/
│       │   ├── useSort.js         # Sort state & comparator
│       │   ├── useSearch.js       # Global search filter
│       │   ├── useFilter.js       # Column-level exact/range filters
│       │   ├── usePagination.js   # Page state, slicing, pagination items
│       │   └── useSelection.js    # Row selection tracking
│       ├── Table.jsx              # Main orchestrator component
│       ├── Table.module.css       # Shared design tokens & base styles
│       └── index.js               # Re-export barrel
├── Data/
│   ├── generateMockData.js        # Node script to regenerate mockTableData.json
│   └── mockTableData.json         # 200 pre-generated vehicle records
├── hooks/
│   └── useWebSocket.js            # Simulated WebSocket with live data mutations
├── utils/
│   └── getDelta.js                # Numeric delta calculator for DeltaPill
├── App.jsx                        # Demo application wiring
├── i18n.js                        # i18next configuration
├── index.css                      # Global styles, CSS variables, background FX
├── index.js                       # Library entry — public exports
└── main.jsx                       # React DOM mount point
```

---

## 🔌 Public API

### Library Exports

```js
// src/index.js
export { Table }      from './Components/Table/Table';
export { DeltaPill }  from './Components/DeltaPill/DeltaPill';
export { getDelta }   from './utils/getDelta';
```

---

## 📖 `<Table />` Props

### Data & Columns

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `Array<Object>` | `[]` | Array of row objects. Each must have a unique `id` field. |
| `columns` | `Array<ColumnDef>` | **required** | Column definitions (see below). |
| `prevData` | `Array<Object>` | `null` | Previous data snapshot for delta calculations. |

#### `ColumnDef` Shape

```js
{
  key: 'speed',           // Row field key
  header: 'Speed',        // Display header text
  width: '9rem',          // Optional CSS width
  render: (row, prevRow) => <span>{row.speed}</span>  // Optional custom renderer
}
```

The `render` function receives the current `row` and the matching `prevRow` (from `prevData`) for delta-aware rendering.

### Tabs

| Prop | Type | Default | Description |
|---|---|---|---|
| `tabs` | `Array<{label, count?}>` | `[]` | Tab definitions with optional badge count. |
| `defaultTab` | `string` | `''` | Initially active tab label. |
| `tabKey` | `string` | `'status'` | Row field used to filter by tab selection. |
| `showTabs` | `bool` | `true` | Show/hide the tab bar. |

### Feature Toggles

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `''` | Title shown when tabs are hidden. |
| `showSearch` | `bool` | `true` | Show global search input. |
| `showFilter` | `bool` | `true` | Show filter dropdown button. |
| `showColumnToggle` | `bool` | `true` | Show column visibility toggle. |
| `showExport` | `bool` | `true` | Show Excel export button. |
| `showRowSelection` | `bool` | `true` | Show row checkboxes. |
| `showPagination` | `bool` | `true` | Show pagination footer. |

### Filtering Configuration

| Prop | Type | Default | Description |
|---|---|---|---|
| `filterableColumns` | `string[]` | all columns | Restrict which columns appear in the filter dropdown. |
| `filterConfig` | `Object` | `{}` | Per-column filter configuration (see below). |

#### `filterConfig` Shape

```js
{
  soc: {
    type: 'range',                       // 'range' | 'exact'
    valueExtractor: (val) => parseInt(val), // Extract numeric value from cell
    ranges: [
      { label: '0 - 20 %', min: 0, max: 20 },
      { label: '21 - 50 %', min: 21, max: 50 },
      // ...
    ],
    searchable: false,                    // Enable search within filter options
  },
  status: {
    type: 'exact',                        // Auto-extracts unique values from data
    searchable: true,
  }
}
```

### Server-Side Mode

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `'client' \| 'server'` | `'client'` | Data processing mode. |
| `totalServerEntries` | `number` | `0` | Total row count for server-side pagination. |
| `onPageChange` | `(page, rowsPerPage) => void` | — | Called when page or rows-per-page changes. |
| `onSortChange` | `(key, direction) => void` | — | Called when sort column/direction changes. |
| `onFilterChange` | `(filters) => void` | — | Called when any filter (tab, search, column) changes. |

### Localization

| Prop | Type | Default | Description |
|---|---|---|---|
| `localeText` | `Object` | see below | Override any UI string. |

#### Default `localeText` values:

```js
{
  searchPlaceholder: "Search",
  filter: "Filter",
  filters: "Filters",
  clearAll: "Clear all",
  noMatches: "No matches",
  clearFilter: "Clear filter",
  columns: "Columns",
  export: "Export",
  refresh: "Refresh",
  showing: "Showing",
  of: "of",
  page: "page",
  rows: "rows",
  previous: "Previous",
  next: "Next",
  goToPage: "Go to page",
}
```

---

## 🧩 Component Architecture

### Data Pipeline (Client Mode)

```
Raw Data
  │
  ▼
Tab Filter ──→ activeTab filters by tabKey
  │
  ▼
Search ──→ Full-text across all Object.values()
  │
  ▼
Column Filters ──→ Exact match or range-based
  │
  ▼
Sort ──→ ASC/DESC by clicked column
  │
  ▼
Paginate ──→ Slice for current page
  │
  ▼
Virtualize ──→ @tanstack/react-virtual renders only visible rows
```

### Component Hierarchy

```
Table
├── Toolbar
│   ├── Tabs (tab bar with animated underline)
│   ├── Search
│   ├── Filter (flyout with nested sub-panels)
│   ├── ColumnToggle
│   ├── Export
│   └── Refresh
├── Header (sticky <thead> with sort icons)
├── Body (virtualized <tbody>)
│   └── BodyRow × N (renders visible rows only)
└── Pagination (footer with page controls)
```

---

## 🪝 Custom Hooks

### `useSort()`

Manages sort state with a toggle mechanism (asc → desc → asc).

```js
const { sortConfig, handleSort, sortData, resetSort } = useSort();
// sortConfig: { key: string | null, direction: 'asc' | 'desc' }
```

### `useSearch()`

Global text filter across all fields in each row.

```js
const { searchQuery, setSearchQuery, filterBySearch, resetSearch } = useSearch();
```

### `useFilter(filterConfig)`

Handles both `exact` (string match) and `range` (numeric bracket) filtering.

```js
const { filters, setColumnFilter, filterData, resetFilters, activeFilterCount } = useFilter(filterConfig);
```

### `usePagination(totalEntries)`

Computes page slicing, pagination item array (with smart ellipsis), and reset.

```js
const {
  currentPage, setCurrentPage,
  rowsPerPage, setRowsPerPage,
  totalPages, startIndex,
  paginationItems,     // [1, 2, 3, 'right', 50]
  paginateData,
  resetPagination,
} = usePagination(totalEntries);
```

### `useSelection()`

Tracks selected row IDs with individual and select-all toggles.

```js
const { selectedIds, toggleSelectAll, toggleSelectRow, resetSelection } = useSelection();
```

### `useWebSocket()` _(Demo only)_

Simulated WebSocket that mutates speed, SOC, and temperature every 3 seconds for 70% of rows.

```js
const { liveData, prevData, isConnected, lastUpdate } = useWebSocket();
```

---

## 🎨 `<DeltaPill />` Component

Visual indicator for real-time value changes. Shows directional arrows with numeric deltas.

```jsx
import { DeltaPill, getDelta } from './index';

const delta = getDelta(row.speed, prevRow?.speed);
// delta: { value: number | '--', direction: 'up' | 'down' | 'same' | 'none' }

<DeltaPill delta={delta} unit=" km/h" />
```

| Direction | Visual |
|---|---|
| `up` | Green pill with `⇑ +{value}{unit}` |
| `down` | Red pill with `⇓ -{value}{unit}` |
| `none` | Gray pill with `~` |
| `same` | Hidden (returns `null`) |

---

## 🛠️ `getDelta(currentStr, prevStr)` Utility

Extracts numeric values from string-formatted cells and computes the directional difference.

```js
getDelta("45 km/h", "40 km/h")  // → { value: 5, direction: 'up' }
getDelta("30%", "30%")           // → { value: 0, direction: 'same' }
getDelta("25 °C", null)          // → { value: '--', direction: 'none' }
```

---

## 🎨 Styling System

### CSS Modules Architecture

All components use **CSS Modules** (`.module.css`) for scoped class names. Each component merges its local styles with shared `Table.module.css` tokens:

```js
// Pattern used in every sub-component
import tableStyles from "../Table.module.css";
import localStyles from "./Component.module.css";

const styles = {};
for (const key of new Set([...Object.keys(tableStyles), ...Object.keys(localStyles)])) {
  styles[key] = [tableStyles?.[key], localStyles[key]].filter(Boolean).join(" ");
}
```

### Design Tokens (CSS Variables)

```css
/* Defined in Table.module.css .ct-container */
--glass-bg: rgba(255, 255, 255, 0.4);
--glass-border: var(--bw-400);
--row-bg: var(--bw-500);
--row-hover-bg: #f4f6f8;
--text-main: #000000;
--text-muted: var(--bw-200);
--radius-main: 20px;
--border-color: var(--bw-400);
--glow-color: var(--primary-color);
```

### Global Variables

```css
/* Defined in index.css :root */
--bw-200: #4f4f4f;
--bw-300: #b0b0b0;
--bw-400: #c0c0c0;
--bw-500: #ffffff;
--primary-color: #0093af;
--color-green: #34c759;
--color-red: #ff2d55;
--color-blue: #32ade6;
```

### Responsive Breakpoints

| Breakpoint | Behavior |
|---|---|
| **≤ 72rem** | Reduced padding, font sizes, avatar sizes |
| **≤ 64rem** | Compact layout, "Showing" label hidden |
| **≤ 56rem** | Icon-only toolbar buttons, status chip borders removed |
| **≤ 48rem** | Ultra-compact mode, pagination numbers hidden |
| **≤ 730px** | Tabs hidden entirely, title fallback shown |

### Visual Effects

- **Glassmorphism** — `backdrop-filter: blur()` on toolbar, footer, and header
- **Floating orbs** — Animated `body::before/::after` pseudo-elements
- **Light ray sweep** — `#root::before` gradient animation
- **Dropdown entry** — `ct-dropdown-enter` keyframe (fade + slide)
- **Tab underline** — `scaleX` transition on active tab `::after`
- **Row flash** — `ct-flash` keyframe for data update highlighting
- **Custom scrollbar** — Appears on hover, thin scrollbar in Firefox

---

## 🌍 i18n Configuration

The app initializes `i18next` with English translations. To add languages, extend the `resources` object in `src/i18n.js`:

```js
resources: {
  en: { translation: { /* ... */ } },
  es: { translation: { /* Spanish strings */ } },
}
```

The `Table` component also accepts a `localeText` prop for quick overrides without touching the i18n config.

---

## 📤 Excel Export

The **Export** button generates a styled `.xlsx` file using `xlsx-js-style`:

- **Header row** — Bold text, blue background (#BADAFF), centered alignment
- **Data rows** — Left-aligned
- **Column width** — Fixed at 200px per column
- **Filename** — `{title} YYYY-MM-DD_HH-MM-SS.xlsx`

Only currently visible columns are exported (respects column toggle).

---

## 🔄 Mock Data Generation

To regenerate `mockTableData.json` with fresh random data:

```bash
node src/Data/generateMockData.js
```

Generates **200 records** with fields: `id`, `vrn`, `type`, `status`, `driver`, `fleet`, `speed`, `soc`, `odometer`, `dte`, `temperature`.

---

## 🧪 Usage Example

```jsx
import { Table, DeltaPill, getDelta } from './index';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const { liveData, prevData } = useWebSocket();

  const columns = [
    { key: 'vrn', header: 'VRN', width: '9rem' },
    { key: 'status', header: 'Status', width: '8rem' },
    { key: 'speed', header: 'Speed', width: '9rem',
      render: (row, prevRow) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>{row.speed}</span>
          <DeltaPill delta={getDelta(row.speed, prevRow?.speed)} unit=" km/h" />
        </div>
      )
    },
  ];

  const tabs = [
    { label: 'All', count: 200 },
    { label: 'Active', count: 120 },
  ];

  const filterConfig = {
    speed: {
      type: 'range',
      valueExtractor: (val) => parseInt(val),
      ranges: [
        { label: '0 km/h', min: 0, max: 0 },
        { label: '1–50 km/h', min: 1, max: 50 },
        { label: '>50 km/h', min: 51, max: Infinity },
      ],
      searchable: false,
    },
    status: { type: 'exact', searchable: true },
  };

  return (
    <Table
      columns={columns}
      data={liveData}
      prevData={prevData}
      tabs={tabs}
      defaultTab="All"
      tabKey="status"
      showTabs={true}
      title="Vehicle Status"
      showSearch={true}
      showFilter={true}
      showColumnToggle={true}
      showExport={true}
      showRowSelection={true}
      showPagination={true}
      filterableColumns={['status', 'speed']}
      filterConfig={filterConfig}
    />
  );
}
```

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint checks |

---

## 📄 License

Private — not published to npm.
