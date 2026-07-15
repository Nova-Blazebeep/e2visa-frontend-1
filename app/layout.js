import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Lato } from "next/font/google";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  variable: "--font-lato",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "E2Visa - Your Gateway to US Business and Immigration",
  description:
    "Buy a business, find an immigration attorney, buy a home and more while getting real time advice all in one place",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        cz-shortcut-listen="true"
        className={`${geistSans.variable} ${geistMono.variable} ${lato.variable} antialiased min-h-screen flex flex-col font-lato`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
