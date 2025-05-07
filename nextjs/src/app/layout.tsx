import "./globals.css";
import type { Metadata } from "next";
import { MainLayout } from "./MainLayout";

export const metadata: Metadata = {
  title: "Rentify - Property Rental Platform",
  description: "Find your perfect rental property with Rentify",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
