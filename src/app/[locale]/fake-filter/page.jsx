import { FakeFilter } from "@/components/FakeFilter/FakeFilter";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const baseUrl = "https://next-intl-blackmyth-wukong.vercel.app";
  const isDefaultLocale = locale === "km";

  return {
    title: t("FakeFilter.title"),
    description: t("FakeFilter.description"),
    openGraph: {
      title: t("FakeFilter.title"),
      description: t("FakeFilter.description"),
      url: isDefaultLocale
        ? baseUrl + "/fake-filter"
        : `${baseUrl}/${locale}/fake-filter`,
      type: "website",
      locale: locale === "km" ? "km-KH" : "en-US",
      siteName: "Tithyareak App",
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App | Fake Filter"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("FakeFilter.title"),
      description: t("FakeFilter.description"),
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
        ? baseUrl + "/fake-filter"
        : `${baseUrl}/${locale}/fake-filter`,
      languages: {
        en: `${baseUrl}/en/fake-filter`,
        km: `${baseUrl}/fake-filter`
      }
    },
    keywords: [
      "fake data generator",
      "fake certificate generator",
      "generate sample JSON schema",
      "free schema generator tool",
      "JSON sample data generator",
      "fake user data generator",
      "certificate schema tool"
    ],
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function Page() {
  const t = useTranslations("FakeFilter");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description: t("description"),
    url: "https://next-intl-blackmyth-wukong.vercel.app/fake-filter",
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
        <FakeFilter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
