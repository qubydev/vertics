import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Vertics",
  description: "Vercel analytics with extra features",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jetBrainsMono.className} h-full antialiased`}>
      <body className="min-h-full flex flex-col pt-24">
        {children}

        <Toaster
          position="bottom-right"
          reverseOrder={false}
        />
      </body>
    </html>
  );
}