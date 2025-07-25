import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "../../../src/i18n/routing";
import { LocaleSwitcher } from "../../components/LocaleSwitcher";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const isDefaultLocale = locale === "km";
  const baseUrl = "https://next-intl-blackmyth-wukong.vercel.app";

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
    alternates: {
      canonical: isDefaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      languages: {
        en: `${baseUrl}/en`,
        km: baseUrl
      }
    }
  };
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <LocaleSwitcher />
      {children}
    </NextIntlClientProvider>
  );
}
