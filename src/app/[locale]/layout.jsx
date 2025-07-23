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
    openGraph: {
      title: t("meta.title"),
      description: t("meta.description"),
      type: "website",
      image: "https://tailwindcss.com/opengraph-image.jpg?fbee406903dc9e88",
      url: isDefaultLocale ? baseUrl : `${baseUrl}/${locale}`,
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
