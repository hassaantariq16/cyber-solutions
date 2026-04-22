import type { Metadata } from "next";
import { Archivo, Lato, Montserrat } from "next/font/google";
import "./globals.css";



const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["600"],
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

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
      <body className={`${archivo.variable} ${lato.variable} ${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
