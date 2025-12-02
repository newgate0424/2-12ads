import type { Metadata } from "next";
import { 
  Inter, 
  Kanit, 
  Sarabun, 
  Prompt
} from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { LanguageProvider } from "@/contexts/language-context";

// Force dynamic rendering for all pages (ใช้ cookies สำหรับ authentication)
export const dynamic = 'force-dynamic'
import { LoadingProvider } from "@/hooks/use-loading";
import { ColorScript } from "@/components/color-script";
import { LayoutWrapper } from "@/components/layout-wrapper";
import { ThemeApplier } from "@/components/theme-applier";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter', display: 'swap' });
const kanit = Kanit({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-kanit', display: 'swap' });
const sarabun = Sarabun({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-sarabun', display: 'swap' });
const prompt = Prompt({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-prompt', display: 'swap' });

export const metadata: Metadata = {
  title: "ads169th System",
  description: "ระบบจัดการผู้ใช้และสิทธิ์การเข้าถึงแบบครบวงจร",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" suppressHydrationWarning>
      <head>
        <ColorScript />
      </head>
      <body className={`
        ${inter.variable} 
        ${kanit.variable} 
        ${sarabun.variable} 
        ${prompt.variable}
      `}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <ThemeApplier />
            <LoadingProvider>
              <LayoutWrapper>
                {children}
              </LayoutWrapper>
            </LoadingProvider>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
