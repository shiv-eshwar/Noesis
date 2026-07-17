import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Noesis",
  description: "Learn anything. One page. Deeply.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
