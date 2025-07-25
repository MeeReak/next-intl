import "./globals.css";
import { Nunito } from "next/font/google";
import { Kantumruy_Pro } from "next/font/google";

// Configure Google Font for English
const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap"
});

// Configure local font for Khmer (assuming you have the font files)
const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer"],
  variable: "--font-kantumruy-pro",
  display: "swap"
});

export default function RootLayout({ children }) {
  return (
    <html lang="km" className={`${nunito.variable} ${kantumruyPro.variable}`}>
      <head>
        <link
          rel="icon"
          href="/favicon.ico"
          sizes="48x48"
          type="image/x-icon"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
