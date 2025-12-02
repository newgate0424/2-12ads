import type { Metadata } from "next";
import { 
  Inter, 
  Roboto, 
  Open_Sans, 
  Lato, 
  Montserrat, 
  Poppins,
  Nunito,
  Ubuntu,
  Kanit, 
  Sarabun, 
  Prompt, 
  Noto_Sans_Thai,
  IBM_Plex_Sans_Thai,
  Mitr,
  Mali,
  Chakra_Petch
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

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const roboto = Roboto({ weight: ['300', '400', '500', '700'], subsets: ["latin"], variable: '--font-roboto' });
const openSans = Open_Sans({ subsets: ["latin"], variable: '--font-open-sans' });
const lato = Lato({ weight: ['300', '400', '700'], subsets: ["latin"], variable: '--font-lato' });
const montserrat = Montserrat({ subsets: ["latin"], variable: '--font-montserrat' });
const poppins = Poppins({ weight: ['300', '400', '500', '600', '700'], subsets: ["latin"], variable: '--font-poppins' });
const nunito = Nunito({ subsets: ["latin"], variable: '--font-nunito' });
const ubuntu = Ubuntu({ weight: ['300', '400', '500', '700'], subsets: ["latin"], variable: '--font-ubuntu' });
const kanit = Kanit({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-kanit' });
const sarabun = Sarabun({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-sarabun' });
const prompt = Prompt({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-prompt' });
const notoSansThai = Noto_Sans_Thai({ subsets: ["latin", "thai"], variable: '--font-noto-sans-thai' });
const ibmPlexSansThai = IBM_Plex_Sans_Thai({ weight: ['300', '400', '500', '600', '700'], subsets: ["latin", "thai"], variable: '--font-ibm-plex-sans-thai' });
const mitr = Mitr({ weight: ['300', '400', '500', '600'], subsets: ["latin", "thai"], variable: '--font-mitr' });
const mali = Mali({ weight: ['300', '400', '500', '600', '700'], subsets: ["latin", "thai"], variable: '--font-mali' });
const chakraPetch = Chakra_Petch({ weight: ['300', '400', '500', '600', '700'], subsets: ["latin", "thai"], variable: '--font-chakra-petch' });

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
        ${roboto.variable} 
        ${openSans.variable} 
        ${lato.variable} 
        ${montserrat.variable} 
        ${poppins.variable}
        ${nunito.variable}
        ${ubuntu.variable}
        ${kanit.variable} 
        ${sarabun.variable} 
        ${prompt.variable} 
        ${notoSansThai.variable}
        ${ibmPlexSansThai.variable}
        ${mitr.variable}
        ${mali.variable}
        ${chakraPetch.variable}
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
