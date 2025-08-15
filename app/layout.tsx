import { Footer } from "@/components/Footer/Footer";
import { Header } from "@/components/Header/Header";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

// https://docs.fontawesome.com/web/use-with/react/use-with
import { FavoriteProvider } from "@/context/FavoriteContext";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

config.autoAddCss = false;

const inter = Inter({ subsets: ["latin"] });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "darts",
  description: "darts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.className} flex flex-col antialiased lg:w-1/3 mx-auto min-h-screen`}
      >
        <FavoriteProvider>
          <div className="sticky top-0 z-50">
            <Header />
          </div>

          <div className="flex-grow bg-[#F1F6F7] relative z-10">{children}</div>
          <div className="sticky bottom-0 z-40">
            <Footer />
          </div>
        </FavoriteProvider>
      </body>
    </html>
  );
}
