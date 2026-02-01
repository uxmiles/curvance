# Subagent Task: UI Components Migration

## Your Mission
Copy and adapt all shadcn/ui components from the source Vite project to the Next.js project.

## Source
`~/Desktop/curvance/src/components/ui/`

## Target  
`~/clawd/curvance-nextjs/src/components/ui/`

## Instructions

1. Copy ALL .tsx and .ts files from source ui/ folder to target
2. For each file, make these changes:
   - Add `'use client';` at the top if the component uses:
     - useState, useEffect, useRef, or other hooks
     - onClick, onChange, or other event handlers
     - Browser APIs (window, document)
   - Update imports: `from "./utils"` → `from "@/lib/utils"`
   - Keep all other imports as-is (Radix, lucide, etc.)

3. Create a barrel file `index.ts` that exports all components

## Files to process (from source):
- accordion.tsx
- alert-dialog.tsx
- alert.tsx
- aspect-ratio.tsx
- breadcrumb.tsx
- calendar.tsx
- card.tsx
- chart.tsx
- drawer.tsx
- hover-card.tsx
- input-otp.tsx
- label.tsx
- navigation-menu.tsx
- pagination.tsx
- popover.tsx
- progress.tsx
- resizable.tsx
- scroll-area.tsx
- sheet.tsx
- slider.tsx
- sonner.tsx
- switch.tsx
- tabs.tsx
- tooltip.tsx
- use-mobile.ts
- utils.ts (if different from lib/utils.ts)

## When done
Write "DONE: UI Components" to ~/clawd/curvance-nextjs/SUBAGENT-UI-COMPONENTS-DONE.md
