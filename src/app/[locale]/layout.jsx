import "./../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../src/i18n/routing";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { getTranslations } from "next-intl/server";
import { ThemeProvider } from "next-themes";
import ThemeToggle from "../../components/ThemeSwitcher";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const isDefaultLocale = locale === "km";
  const baseUrl = "https://next-js-intl.vercel.app";

  return {
    title: t("meta.title"),
    description: t("meta.description"),

    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" }
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
      shortcut: [{ url: "/favicon.ico" }],
      other: [
        {
          rel: "android-chrome",
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          rel: "android-chrome",
          url: "/android-chrome-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    },

    manifest: "/site.webmanifest",

    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      url: isDefaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App"
        }
      ],
      siteName: "Tithyareak App By Anonymous",
      locale: locale === "km" ? "km-KH" : "en-US"
    },

    twitter: {
      card: "summary_large_image",
      title: t("meta.title"),
      description: t("meta.description"),
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App"
        }
      ]
    },

    alternates: {
      canonical: isDefaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        km: `${baseUrl}`
      }
    },

    keywords: [
      "case converter",
      "text transformer",
      "uppercase",
      "lowercase",
      "title case",
      "free tool"
    ],
    robots: {
      index: true,
      follow: true,
      nocache: false
    }
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();
  const fontClass = locale === "km" ? "font-kantumruy" : "font-nunito";

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <NextIntlClientProvider messages={messages}>
        <LocaleSwitcher />
        <ThemeToggle />
        <div className={fontClass}>{children}</div>
      </NextIntlClientProvider>
    </ThemeProvider>
  );
}
