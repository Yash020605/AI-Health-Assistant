import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import DisclaimerBanner from "../components/DisclaimerBanner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Health Information Assistant",
  description: "A GenAI-powered health awareness and symptom checker.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body>
        <DisclaimerBanner />
        {children}
      </body>
    </html>
  );
}
