import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Digital Identity",
  description: "Luxury digital business card",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="ko"><body>{children}</body></html>;
}