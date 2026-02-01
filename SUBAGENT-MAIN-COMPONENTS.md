# Subagent Task: Main Components Migration

## Your Mission
Migrate all main application components from Vite/React to Next.js compatible format.

## Source
`~/Desktop/curvance/src/components/` (NOT the ui/ subfolder)

## Target
`~/clawd/curvance-nextjs/src/components/`

## Components to Migrate
- APYBreakdown.tsx
- CurvanceLogo.tsx
- DepositFilter.tsx
- DepositPanel.tsx (large: 24KB)
- DynamicHealthBars.tsx
- HealthBarsIcon.tsx
- HideBalanceIcon.tsx
- LeveragePanel.tsx
- MarketDetails.tsx (largest: 67KB) 
- MarketList.tsx (25KB)
- MarketView.tsx
- MonadChainIcon.tsx
- Navbar.tsx
- OracleIcons.tsx
- TokenIcons.tsx
- Tooltip.tsx
- TransactionFlow.tsx

## Migration Rules

1. **Add 'use client' directive** to ALL components that use:
   - useState, useEffect, useRef, useMemo, useCallback
   - onClick, onChange, onSubmit handlers
   - motion/framer-motion animations
   - useParams, useNavigate from react-router-dom

2. **Replace react-router-dom imports**:
   ```tsx
   // OLD
   import { useParams, useNavigate } from 'react-router-dom';
   
   // NEW
   import { useParams } from 'next/navigation';
   import { useRouter } from 'next/navigation';
   
   // And replace usage:
   // const navigate = useNavigate() → const router = useRouter()
   // navigate('/path') → router.push('/path')
   // navigate(-1) → router.back()
   ```

3. **Update component imports**:
   - `from './ComponentName'` stays same (relative)
   - `from '../imports/...'` → copy those files to components or inline
   - `from "./ui/..."` → `from "@/components/ui/..."`

4. **Handle figma:asset imports**:
   ```tsx
   // OLD
   import img from 'figma:asset/HASH.png';
   
   // NEW - Option A: Static path
   const img = '/assets/HASH.png';
   
   // NEW - Option B: Next.js Image
   import Image from 'next/image';
   <Image src="/assets/HASH.png" alt="..." width={X} height={Y} />
   ```

5. **Keep motion/react imports as-is** - they work in Next.js

## Also copy these from imports/ folder
`~/Desktop/curvance/src/imports/` - Copy these to `src/components/`:
- Monad.tsx
- Button.tsx (if exists)
- Frame3.tsx
- WEth.tsx
- FloppyCoin.tsx
- All svg-*.ts files (SVG path data)

## When done
Write "DONE: Main Components" to ~/clawd/curvance-nextjs/SUBAGENT-MAIN-COMPONENTS-DONE.md
