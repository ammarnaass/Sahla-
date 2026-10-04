import type { Metadata, Viewport } from "next";
import { Cairo, Tajawal, Outfit } from "next/font/google";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./globals.css";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-cairo",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-outfit",
  display: "swap",
});

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
      suppressHydrationWarning
      className={`${cairo.variable} ${tajawal.variable} ${outfit.variable}`}
    >
      <head>
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
      <body className="font-[family-name:var(--font-cairo)]">
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>{children}</AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
