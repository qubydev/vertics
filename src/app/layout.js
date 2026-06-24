import { JetBrains_Mono } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Vertics",
  description: "Vercel analytics with extra features",
};

function getInitialThemeClass(theme, resolvedTheme) {
  if (theme === "dark" || resolvedTheme === "dark") return "dark";
  return "";
}

export default async function RootLayout({ children }) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("vertics-theme")?.value;
  const resolvedTheme = cookieStore.get("vertics-resolved-theme")?.value;
  const initialThemeClass = getInitialThemeClass(theme, resolvedTheme);

  return (
    <html lang="en" className={`${jetBrainsMono.className} ${initialThemeClass} h-full antialiased`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}

          <Toaster
            position="bottom-right"
            reverseOrder={false}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
