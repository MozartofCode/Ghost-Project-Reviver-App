import type { Metadata } from "next";
import { Outfit } from "next/font/google"; // Changed to Outfit
import "./globals.css";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
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
    // Default to light mode for the 'Overgrown' theme usually, but respecting system pref is good.
    // However, the user asked for a specific look. Let's make sure 'light' class is available or just let system decide.
    // Given the prompt "Cream/Forest" look, it works best in Light mode. 
    // I will remove 'dark' class from html to default to light, but allow proper switching if needed later.
    <html lang="en">
      <body className={`${outfit.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
