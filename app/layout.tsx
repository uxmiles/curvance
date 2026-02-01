import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { DevToolbar } from '@/components/DevToolbar';
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
          <DevToolbar />
        </ThemeProvider>
      </body>
    </html>
  );
}
