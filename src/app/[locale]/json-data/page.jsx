import { JsonData } from "@/components/JsonData/JsonData";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const baseUrl = "https://next-js-intl.vercel.app";
  const isDefaultLocale = locale === "km";

  return {
    title: t("JsonData.title"),
    description: t("JsonData.description"),
    openGraph: {
      title: t("JsonData.title"),
      description: t("JsonData.description"),
      url: isDefaultLocale
        ? baseUrl + "/json-data"
        : `${baseUrl}/${locale}/json-data`,
      type: "website",
      locale: locale === "km" ? "km-KH" : "en-US",
      siteName: "Tithyareak App",
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App | Json Data Generation Tool"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("JsonData.title"),
      description: t("JsonData.description"),
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
      canonical: isDefaultLocale
        ? baseUrl + "/json-data"
        : `${baseUrl}/${locale}/json-data`,
      languages: {
        en: `${baseUrl}/en/json-data`,
        km: `${baseUrl}/json-data`
      }
    },
    keywords: ["qr code reader", "image upload", "qr scanner", "free tool"],
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function Page() {
  const t = useTranslations("JsonData");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description: t("description"),
    url: "https://next-js-intl.vercel.app/json-data",
    author: {
      "@type": "Organization",
      name: "Tithyareak App"
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD"
    }
  };

  return (
    <>
      <main className="min-h-screen p-6">
        <h1 className="text-3xl font-bold text-center mb-4">{t("title")}</h1>
        <JsonData />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
