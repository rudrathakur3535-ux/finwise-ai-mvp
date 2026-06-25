import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import Script from "next/script";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "FinWise AI - Your AI Financial Advisor",
  description: "Personalized investment plan in 2 minutes. Free.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        
        {/* Google Translate Script for Hindi Support */}
        <div id="google_translate_element" className="fixed bottom-4 left-4 z-50"></div>
        <Script id="google-translate-init" strategy="afterInteractive">
          {`
            function googleTranslateElementInit() {
              new google.translate.TranslateElement(
                { pageLanguage: 'en', includedLanguages: 'hi,en', layout: google.translate.TranslateElement.InlineLayout.SIMPLE },
                'google_translate_element'
              );
            }
          `}
        </Script>
        <Script 
          src="//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit" 
          strategy="afterInteractive" 
        />
      </body>
    </html>
  );
}
