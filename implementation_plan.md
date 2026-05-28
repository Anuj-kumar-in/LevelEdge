# LevelEdge — Compensation Intelligence System

## Track C · Frontend Engineer Role · PRIMARY FOCUS: FRONTEND

> A **Levels.fyi-inspired** compensation intelligence platform that helps engineers compare salaries across companies, roles, and levels with structured, filterable data and intelligent AI-powered insights.

> [!IMPORTANT]
> **Frontend is the PRIMARY deliverable.** Backend is minimal — just enough Express + MongoDB to serve data. All evaluation focus is on UI architecture, rendering logic, state management, extensibility, and reliability.

---

## Background & Research

### Reference Platform Analysis

| Feature | Levels.fyi | 6figr | AmbitionBox | Glassdoor | **Build?** |
|---|---|---|---|---|---|
| Searchable salary tables | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| Level-based comparison | ✅ | ❌ | ❌ | ❌ | **✅ Yes** |
| Company salary pages | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| Side-by-side comparison | ✅ | ❌ | ✅ | ❌ | **✅ Yes** |
| Compensation visualizations | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| Salary submission form | ✅ | ✅ | ✅ | ✅ | **✅ Yes** |
| AI-powered insights | ❌ | ❌ | ❌ | ❌ | **✅ Yes (Gemini)** |
| Authentication | ✅ | ✅ | ✅ | ✅ | ❌ Simplified |
| Job board | ✅ | ❌ | ✅ | ✅ | ❌ Out of scope |
| Negotiation tools | ✅ | ❌ | ❌ | ❌ | ❌ Out of scope |

### Key Observations
1. **Levels matter more than job titles** — This is the core principle. Our system organizes data by standardized levels (L3-L10+)
2. **Total Compensation (TC)** is the primary metric — Base + Bonus + Stock = TC
3. **Structured data presentation** is critical — Tables with sorting/filtering are the primary UI pattern
4. **Comparison workflows** drive user engagement — Side-by-side company comparison is a killer feature

---

## Design System — "Corporate Engineering Minimal" (CipherPulse Reference)

> Matching the **CipherPulse landing page** aesthetic — clean white backgrounds, navy typography, light blue accents, glassmorphism cards.

### Color Palette
```
Background:      #FFFFFF (pure white)
Surface:         #F4F9FC (light blue-gray tint — card backgrounds)
Surface-2:       #F8FAFC (elevated/hover surfaces)
Border:          #E2E8F0 (subtle gray borders)
Text Primary:    #002F56 (navy — headings, strong text)
Text Body:       #0F172A (near-black — body text)
Text Secondary:  #475569 (muted slate gray)
Text Tertiary:   #64748B (meta text, labels)
Accent:          #29B6F6 (sky blue — primary CTAs, links)
Accent Hover:    #00A3E0 (deeper cyan — hover states)
Accent Subtle:   rgba(41,182,246,0.08) (blue tint backgrounds)
Success:         #10B981 (green)
Danger:          #EF4444 (red)
Warning:         #F59E0B (amber)
Sidebar Dark:    #0C1A2E (dark navy — for sidebar only)
```

### Typography
- **Font**: `Outfit` primary, `Inter` fallback — clean, corporate, engineering-grade
- **Headings**: 800-900 weight, tight tracking, navy `#002F56`
- **Body**: 400 weight, relaxed line-height, `#0F172A`
- **Data/Numbers**: Tabular-nums (monospace numbers for alignment)
- **Labels**: 11px, uppercase, letter-spacing 1px, bold, `#475569`

### Design Principles (Matching CipherPulse)
1. **Light-first** — White/off-white backgrounds, dark navy sidebar accent
2. **High contrast** — Navy text on white backgrounds, sky blue CTAs pop
3. **Data-dense** — Tables and charts are first-class citizens
4. **Glass cards** — `rgba(255,255,255,0.8)` with `backdrop-filter: blur(12px)`, subtle box-shadow
5. **Micro-animations** — Hover translateY(-1px), smooth transitions, skeleton loaders
6. **Pill buttons** — Rounded full (`border-radius: 9999px`), uppercase, letter-spacing
7. **Icon-forward** — Lucide React icons throughout for visual hierarchy
8. **Radial gradient hero** — Subtle `radial-gradient` from light blue to white on hero sections

---

## Project Structure

```
c:\practice\CipherPulse\compensation-app\
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vite.config.ts
├── postcss.config.js
├── .env                          # VITE_GEMINI_API_KEY
├── server/                       # Express + MongoDB backend
│   ├── index.ts                  # Express server entry
│   ├── db.ts                     # MongoDB connection
│   ├── models/
│   │   ├── Salary.ts             # Salary submission model
│   │   └── Company.ts            # Company profile model
│   ├── routes/
│   │   ├── salaries.ts           # CRUD + search + filter APIs
│   │   ├── companies.ts          # Company aggregation APIs
│   │   └── ai.ts                 # Gemini AI proxy route
│   └── seed.ts                   # Database seeder with realistic data
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx                  # App entry point
    ├── App.tsx                   # Router + layout
    ├── index.css                 # Global styles + Tailwind
    ├── types/
    │   ├── salary.ts             # Salary data types
    │   ├── company.ts            # Company types
    │   └── filters.ts            # Filter state types
    ├── hooks/
    │   ├── useSalaries.ts        # Salary data fetching + caching
    │   ├── useCompanies.ts       # Company data fetching
    │   ├── useFilters.ts         # Filter state management
    │   ├── useComparison.ts      # Comparison state
    │   └── useDebounce.ts        # Input debouncing
    ├── lib/
    │   ├── api.ts                # Axios API client
    │   ├── gemini.ts             # Gemini AI integration
    │   ├── formatters.ts         # Currency, number formatters
    │   └── constants.ts          # Companies, levels, roles data
    ├── components/
    │   ├── layout/
    │   │   ├── Header.tsx        # Top navigation bar
    │   │   ├── Footer.tsx        # Site footer
    │   │   ├── Sidebar.tsx       # Filter sidebar
    │   │   └── Container.tsx     # Content wrapper
    │   ├── ui/
    │   │   ├── Button.tsx        # Reusable button
    │   │   ├── Input.tsx         # Styled input
    │   │   ├── Select.tsx        # Dropdown select
    │   │   ├── Badge.tsx         # Status badge
    │   │   ├── Card.tsx          # Data card
    │   │   ├── Modal.tsx         # Modal overlay
    │   │   ├── Skeleton.tsx      # Loading skeleton
    │   │   ├── Tooltip.tsx       # Info tooltip
    │   │   └── EmptyState.tsx    # Empty/error states
    │   ├── salary/
    │   │   ├── SalaryTable.tsx   # Main sortable data table
    │   │   ├── SalaryRow.tsx     # Individual table row
    │   │   ├── SalaryFilters.tsx # Filter controls panel
    │   │   ├── SalaryStats.tsx   # Aggregate statistics
    │   │   └── SubmitSalary.tsx  # Salary submission form
    │   ├── company/
    │   │   ├── CompanyCard.tsx   # Company overview card
    │   │   ├── CompanyHeader.tsx # Company page header
    │   │   ├── CompanyStats.tsx  # Company salary statistics
    │   │   └── LevelBreakdown.tsx# Level-wise compensation
    │   ├── comparison/
    │   │   ├── ComparePanel.tsx  # Side-by-side comparison
    │   │   ├── CompareSelector.tsx # Company/role picker
    │   │   └── CompareChart.tsx  # Visual comparison chart
    │   ├── charts/
    │   │   ├── TcDistribution.tsx # TC distribution chart
    │   │   ├── LevelChart.tsx    # Level-wise bar chart
    │   │   └── TrendChart.tsx    # TC trend over time
    │   └── ai/
    │       ├── AiInsightPanel.tsx# AI insights display
    │       └── AiChatWidget.tsx  # AI chat assistant
    └── pages/
        ├── HomePage.tsx          # Landing + search
        ├── SalariesPage.tsx      # Main salary explorer
        ├── CompanyPage.tsx       # Individual company view
        ├── ComparePage.tsx       # Comparison tool
        ├── SubmitPage.tsx        # Submit salary data
        └── NotFoundPage.tsx      # 404 page
```

---

## Feature Implementation Plan

### Feature 1: Searchable Salary Tables with Sorting & Filtering

The primary view — a data-dense, sortable, filterable salary table.

#### [NEW] `src/pages/SalariesPage.tsx`
- Full-width salary data table with infinite scroll
- Filter sidebar (company, role, level, location, YOE range, TC range)
- Sort by: TC, Base, Stock, Bonus, Date, YOE
- Search by company name or role title
- Aggregate stats bar (median TC, count, avg YOE)

#### [NEW] `src/components/salary/SalaryTable.tsx`
- Virtualized table for performance with large datasets (500+ rows)
- Column headers with sort indicators (▲▼)
- Responsive: collapses to card view on mobile
- Hover effects with row highlight
- Click to expand for full details

#### [NEW] `src/components/salary/SalaryFilters.tsx`
- Multi-select dropdowns for company, role, level, location
- Range sliders for TC and YOE
- Active filter tags with clear button
- "Reset All" functionality
- Filter count badge

#### [NEW] `src/hooks/useFilters.ts`
- Centralized filter state with URL sync
- Debounced search input
- Filter persistence across navigation

---

### Feature 2: Company Salary Pages

Individual company pages with detailed compensation data.

#### [NEW] `src/pages/CompanyPage.tsx`
- Company header with logo, name, industry, employee count
- Level-wise compensation breakdown table
- TC distribution visualization (bar/box chart)
- Role-wise salary cards
- Recent salary submissions
- AI-powered compensation insights via Gemini

#### [NEW] `src/components/company/LevelBreakdown.tsx`
- Table showing: Level | Base Range | Stock Range | Bonus Range | TC Range | Count
- Color-coded level badges
- Clickable to filter salary table by level

---

### Feature 3: Side-by-Side Company Comparison

Compare compensation across 2-3 companies.

#### [NEW] `src/pages/ComparePage.tsx`
- Company selector (search + select up to 3 companies)
- Side-by-side comparison table by level
- Visual bar chart comparing TC at each level
- Delta indicators (which company pays more)
- Role-specific comparison mode

#### [NEW] `src/components/comparison/ComparePanel.tsx`
- Structured grid layout: Company columns × Level rows
- Highlight highest TC per level in green
- Total compensation breakdown (base/stock/bonus)

#### [NEW] `src/components/comparison/CompareChart.tsx`
- Grouped bar chart using Recharts
- Level on X-axis, TC on Y-axis
- Color-coded by company
- Hover tooltips with detailed breakdown

---

### Feature 4: AI-Powered Compensation Insights (Gemini)

AI features that differentiate from competitors.

#### [NEW] `src/components/ai/AiInsightPanel.tsx`
- "Ask about compensation" chat input
- Pre-built prompt suggestions:
  - "What's the typical TC for L5 at Google?"
  - "Compare Meta vs Google for senior engineers"
  - "What's the salary growth from L4 to L5?"
- Streaming response display
- Context-aware: passes current page data to Gemini

#### [NEW] `src/lib/gemini.ts`
- Gemini API integration via `@google/generative-ai`
- System prompt with compensation domain knowledge
- Response parsing and formatting
- Rate limiting and error handling

#### [NEW] `server/routes/ai.ts`
- Proxy route to Gemini API (keeps API key server-side)
- Context injection (salary data summary)
- Response streaming

---

### Feature 5: Salary Submission Form

Crowdsourced data collection.

#### [NEW] `src/pages/SubmitPage.tsx`
- Multi-step form with validation
- Fields: Company, Level, Role, Location, YOE, Base, Stock, Bonus, Date
- Auto-calculate TC
- Company name autocomplete
- Level standardization helper
- Success confirmation with animation

---

## Backend (Lightweight Express + MongoDB)

> [!IMPORTANT]
> While the role is Frontend Engineer, we need a functional backend for data. This will be a lightweight Express.js server with MongoDB.

### Database Schema

```typescript
// Salary Document
{
  company: string,        // Normalized company name
  role: string,           // e.g., "Software Engineer"
  level: string,          // e.g., "L5", "E5", "Senior"
  location: string,       // e.g., "San Francisco, CA"
  yoe: number,            // Years of experience
  base: number,           // Base salary
  stock: number,          // Annual stock/equity
  bonus: number,          // Annual bonus
  tc: number,             // Total compensation (calculated)
  date: Date,             // Submission date
  verified: boolean       // Data verification flag
}
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/salaries` | List with filters, sort, pagination |
| GET | `/api/salaries/stats` | Aggregate statistics |
| POST | `/api/salaries` | Submit new salary |
| GET | `/api/companies` | List all companies |
| GET | `/api/companies/:slug` | Company detail + stats |
| GET | `/api/companies/:slug/levels` | Level breakdown |
| GET | `/api/compare` | Compare companies |
| POST | `/api/ai/insights` | Gemini AI proxy |

### Seed Data
- 500+ realistic salary entries across 20+ major tech companies
- Levels: L3-L10 (Google), E3-E8 (Meta), 59-70 (Microsoft), etc.
- Locations: SF, NYC, Seattle, Austin, Bangalore, London
- Roles: SWE, PM, Data Scientist, ML Engineer, DevOps

---

## User Review Required

> [!IMPORTANT]
> **Project Location**: I plan to create this as `c:\practice\CipherPulse\compensation-app\` — a new directory within the existing workspace. Should I place it elsewhere?

> [!IMPORTANT]
> **MongoDB Setup**: The plan uses MongoDB. Do you have MongoDB installed locally, or should I use MongoDB Atlas (cloud) connection string? I'll need your MongoDB connection URI or I can set up a local connection.

> [!IMPORTANT]
> **Gemini API Key**: You mentioned using Gemini API. Please provide your API key or I'll set up the `.env` file for you to fill in.

---

## Open Questions

> [!WARNING]
> **Deployment**: The assignment asks for a live URL. Do you want me to configure deployment to Vercel (frontend) + Railway/Render (backend)? Or will you handle deployment separately?

> [!NOTE]
> **Data Source**: I'll generate a realistic seed dataset with 500+ salary entries. This is acceptable per the assignment ("You may use mock or generated datasets, but all data must come from the database and APIs").

---

## Verification Plan

### Automated Tests
- Build verification: `npm run build` passes with zero errors
- TypeScript strict mode: no type errors
- Responsive testing via Chrome DevTools at 320px, 768px, 1024px, 1440px

### Manual Verification
- All filter combinations work correctly
- Table sorting is accurate (ascending/descending)
- Company pages load with correct aggregated data
- Comparison tool shows accurate side-by-side data
- AI insights return relevant, contextual responses
- Graceful error handling for API failures
- Smooth animations and transitions throughout
- Empty states and loading skeletons display correctly

### Browser Testing
- Chrome DevTools responsive mode verification
- Interactive testing of all user flows
- Performance audit via Lighthouse
