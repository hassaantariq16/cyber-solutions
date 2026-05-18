import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CyberSolutions - Blog Management",
  description: "Professional blog management system with rich text editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

