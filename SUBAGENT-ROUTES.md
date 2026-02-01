# Subagent Task: App Router Pages

## Your Mission
Create the Next.js App Router pages and layout.

## Files to Create

### 1. app/layout.tsx
```tsx
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import './globals.css';

export const metadata: Metadata = {
  title: 'Curvance',
  description: 'Curvance DeFi Protocol',
  icons: {
    icon: '/assets/09851cc617ea3111d119ceb8fb40afbe6eeddf12.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="min-h-screen bg-[#0a0a0a]">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. app/page.tsx (Home - MarketView)
```tsx
import { MarketView } from '@/components/MarketView';

export default function HomePage() {
  return <MarketView />;
}
```

### 3. app/market/[marketId]/page.tsx (Market Details)
```tsx
import { MarketDetails } from '@/components/MarketDetails';

interface Props {
  params: Promise<{ marketId: string }>;
}

export default async function MarketPage({ params }: Props) {
  const { marketId } = await params;
  return <MarketDetails marketId={marketId} />;
}
```

## Additional Notes

1. The MarketDetails component currently uses `useParams()` internally.
   - Either: Update the component to accept marketId as a prop
   - Or: Keep using useParams from next/navigation (it works in client components)

2. Verify globals.css was copied correctly and has proper Tailwind imports:
   ```css
   @import "tailwindcss";
   ```

3. Make sure the favicon path matches an actual asset file.

## When done
Write "DONE: Routes" to ~/clawd/curvance-nextjs/SUBAGENT-ROUTES-DONE.md
