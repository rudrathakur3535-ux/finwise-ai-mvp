import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "FinWise AI - Premium AI Financial Advisor",
  description: "Personalized investment plan in 2 minutes. Free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-foreground relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
        
        <Navbar />
        
        <main className="flex-grow z-10 w-full relative">
          {children}
        </main>

        <Script
          type="text/javascript"
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
          strategy="afterInteractive"
        />
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement({pageLanguage: 'en', includedLanguages: 'hi,en', autoDisplay: false}, 'google_translate_element');
            }
          `}
        </Script>
        
        <div id="google_translate_element" className="hidden"></div>
      </body>
    </html>
  );
}
