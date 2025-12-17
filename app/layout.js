import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { createClient } from "@/utils/supabase/server";

import { ThemeProvider } from "@/context/ThemeContext";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata = {
  title: "معهد المسارات التطبيقية العالي للتدريب",
  description: "منصة تعليمية تفاعلية لتعلم الطباعة السريعة باللغتين العربية والإنجليزية.",
};

export default async function RootLayout({ children }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <html suppressHydrationWarning>
      <body className={outfit.className}>
        <ThemeProvider>
          <LanguageProvider>
            <div className="flex flex-col min-h-screen transition-colors duration-300">
              <Navbar user={user} />
              <main className="flex-grow">{children}</main>
              <Footer />
            </div>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
