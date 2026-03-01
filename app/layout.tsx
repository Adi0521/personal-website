import type { Metadata } from "next";
import "@fontsource/syne/400.css";
import "@fontsource/syne/700.css";
import "@fontsource/syne/800.css";
import "./globals.css";
import { SoundProvider } from "@/components/providers/SoundProvider";

export const metadata: Metadata = {
  title: "Aditya Kewalram",
  description:
    "CS + Bioengineering @ UIUC. Building at the intersection of software, ML, and biology.",
  openGraph: {
    title: "Aditya Kewalram",
    description:
      "CS + Bioengineering @ UIUC. Building at the intersection of software, ML, and biology.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Clash Display from Fontshare */}
        <link
          rel="stylesheet"
          href="https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap"
        />
      </head>
      <body>
        <SoundProvider>{children}</SoundProvider>
      </body>
    </html>
  );
}
