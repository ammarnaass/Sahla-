import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

const cairo = localFont({
  src: [
    { path: "../../public/fonts/Cairo-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Cairo-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Cairo-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Cairo-ExtraBold.ttf", weight: "800", style: "normal" },
    { path: "../../public/fonts/Cairo-Black.ttf", weight: "900", style: "normal" },
  ],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = localFont({
  src: [
    { path: "../../public/fonts/Tajawal-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Tajawal-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/Tajawal-Bold.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Tajawal-ExtraBold.ttf", weight: "800", style: "normal" },
  ],
  variable: "--font-tajawal",
  display: "swap",
});

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { MuiThemeProvider } from "@/components/ui/MuiThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "سهلة · Sahla — كل وثيقة في دقائق 🇩🇿",
  description:
    "منصة الخدمات الرقمية الأولى لأصحاب الكيوسكات، المكتبات ومقاهي الإنترنت في الجزائر. أنجز وثائق زبائنك من الهاتف في دقائق.",
  keywords: [
    "سهلة",
    "sahla",
    "كيوسك",
    "مكتبة",
    "جزائر",
    "cybercafe",
    "سيرة ذاتية",
    "فاتورة",
  ],
  authors: [{ name: "Sahla Team" }],
  manifest: "/manifest.json",
  other: {
    "application-name": "سهلة · Sahla",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#059669",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${cairo.variable} ${tajawal.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme")||"dark";var r=document.documentElement;if(t==="light"){r.classList.add("light");r.classList.remove("dark");r.setAttribute("data-theme","light");r.style.colorScheme="light";}else{r.classList.add("dark");r.classList.remove("light");r.setAttribute("data-theme","dark");r.style.colorScheme="dark";}}catch(e){}})()`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Sahla · سهلة",
              operatingSystem: "All (Web, Android, iOS, Windows)",
              applicationCategory: "BusinessApplication",
              description:
                "منصة الخدمات الرقمية المتكاملة لأصحاب الكيوسكات والمكتبات ومقاهي الإنترنت في الجزائر.",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "DZD",
                description: "50 نقطة تجريبية مجانية عند التسجيل",
              },
              inLanguage: ["ar", "fr", "en"],
              countryOfOrigin: "DZ",
            }),
          }}
        />
      </head>
      <body className="font-[family-name:var(--font-cairo)] bg-background text-foreground min-h-screen transition-colors duration-200">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              <MuiThemeProvider>
                {children}
              </MuiThemeProvider>
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
