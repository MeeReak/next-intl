import "./globals.css";
import { Nunito } from "next/font/google";
import { Kantumruy_Pro } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
  preload: true
});

const kantumruyPro = Kantumruy_Pro({
  subsets: ["khmer"],
  variable: "--font-kantumruy-pro",
  display: "swap",
  preload: true
});

export default function RootLayout({ children }) {
  return (
    <html
      id="hide-scrollbar"
      lang="km"
      className={`${nunito.variable} ${kantumruyPro.variable}`}
      suppressHydrationWarning
    >
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
