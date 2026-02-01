# Curvance Vite → Next.js Migration

## Source Project
- **Location**: `~/Desktop/curvance/`
- **Type**: Vite + React + react-router-dom (Figma export)
- **Files**: ~86 TypeScript/TSX files, 2.1MB source

## Target Project
- **Location**: `~/clawd/curvance-nextjs/`
- **Type**: Next.js 14+ App Router
- **GitHub**: Will be `uxmiles/curvance` (create new)

## Routes to Migrate
1. `/` → MarketView component
2. `/market/:marketId` → MarketDetails component

## Key Migration Tasks

### 1. Figma Asset Imports
Source uses `figma:asset/HASH.png` imports. These map to:
- `~/Desktop/curvance/src/assets/HASH.png`

**Solution**: 
- Copy all PNGs to `public/assets/`
- Replace `figma:asset/HASH.png` with `/assets/HASH.png`
- Or use next/image with imports from `@/assets/`

Asset files:
- 09851cc617ea3111d119ceb8fb40afbe6eeddf12.png (favicon)
- 0a1ccd87f1eb1a186920933b0a1745093459c3cf.png
- 0f971b8c9396aa4950c6c6aea19cf5b391f88624.png
- 0fd9d17e01d4a477a0942e87a3c2c813858efb26.png
- 360e29561903d1ebe4cd59a66c1b10e3f3e3b25b.png
- 787cb2455c17e7722fdecb027b1b0f13b925e3ab.png
- c48268fe82c18afb7e40c4c8480ed24d37139fe8.png

### 2. react-router-dom → App Router
- Remove `BrowserRouter`, `Routes`, `Route` usage
- Convert to file-based routing:
  - `app/page.tsx` (home)
  - `app/market/[marketId]/page.tsx` (dynamic route)
- Replace `useParams` with page props: `{ params: { marketId } }`
- Replace `useNavigate` with `next/navigation`'s `useRouter`

### 3. Client Components
Components using these need `'use client'` directive:
- useState, useEffect, useRef
- onClick, onChange handlers
- motion/framer-motion
- Any browser APIs

### 4. Dependencies to Update
**Keep**:
- All @radix-ui/* packages
- lucide-react
- motion (framer-motion)
- class-variance-authority, clsx, tailwind-merge
- recharts
- sonner, vaul
- react-hook-form
- next-themes

**Remove**:
- react-router-dom
- vite, @vitejs/plugin-react-swc

**Add**:
- next
- @types/react, @types/react-dom (if not present)

### 5. Styling
- Copy `src/styles/globals.css` → `app/globals.css`
- Uses Tailwind v4 syntax (@custom-variant, @theme inline)
- Dark mode via class (`.dark`)

### 6. shadcn/ui Components
- Copy `src/components/ui/*` → `src/components/ui/`
- These are already compatible with Next.js

## File Structure (Target)

```
curvance-nextjs/
├── app/
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # MarketView (home)
│   ├── globals.css         # Styles
│   ├── market/
│   │   └── [marketId]/
│   │       └── page.tsx    # MarketDetails
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── ui/             # shadcn components
│   │   ├── MarketView.tsx
│   │   ├── MarketDetails.tsx
│   │   ├── MarketList.tsx
│   │   ├── DepositPanel.tsx
│   │   ├── Navbar.tsx
│   │   └── ... (other components)
│   └── lib/
│       └── utils.ts
├── public/
│   └── assets/             # PNG files
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Component Checklist
- [ ] MarketView.tsx
- [ ] MarketDetails.tsx (largest: 67KB)
- [ ] MarketList.tsx
- [ ] DepositPanel.tsx (24KB)
- [ ] LeveragePanel.tsx
- [ ] Navbar.tsx
- [ ] DepositFilter.tsx
- [ ] TokenIcons.tsx
- [ ] OracleIcons.tsx
- [ ] APYBreakdown.tsx
- [ ] Tooltip.tsx
- [ ] TransactionFlow.tsx
- [ ] CurvanceLogo.tsx
- [ ] MonadChainIcon.tsx
- [ ] HealthBarsIcon.tsx
- [ ] HideBalanceIcon.tsx
- [ ] DynamicHealthBars.tsx
- [ ] All imports/*.tsx files (SVG/Figma components)
- [ ] All ui/*.tsx components (shadcn)

## Notes
- The original App.tsx sets favicon and title via useEffect - move to metadata in layout.tsx
- Dark mode is forced via `className="dark"` on root div - configure in layout
- motion/react is the new Framer Motion import style - keep it
