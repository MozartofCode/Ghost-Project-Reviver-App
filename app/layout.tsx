import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Project Phoenix - Revive Abandoned Open-Source Projects",
  description: "Discover valuable abandoned repositories, form revival squads, and breathe new life into ghost projects. Join the open-source revival movement.",
  keywords: ["open-source", "github", "abandoned projects", "project revival", "collaborative coding", "open source maintenance"],
  authors: [{ name: "Project Phoenix Team" }],
  openGraph: {
    title: "Project Phoenix - Revive Abandoned Open-Source Projects",
    description: "Give abandoned open-source projects a second life",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
