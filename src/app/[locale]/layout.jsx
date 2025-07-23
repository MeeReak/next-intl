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
      icon: [{ url: "/favicon.ico", sizes: "any", type: "image/x-icon" }]
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
          alt: "Next Intl Blackmyth Wukong"
        }
      ],
      siteName: "Next Intl By Anonymous"
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
