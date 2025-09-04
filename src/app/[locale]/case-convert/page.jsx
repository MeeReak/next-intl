import { CaseCover } from "@/components/CaseConvert/CaseCover";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const isDefaultLocale = locale === "km";
  const baseUrl = "https://next-js-intl.vercel.app";

  return {
    title: t("CaseConverter.title"),
    description: t("CaseConverter.description"),

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
      url: isDefaultLocale ? baseUrl : `${baseUrl}/${locale}`,
      type: "website",
      locale: locale === "km" ? "km-KH" : "en-US",
      siteName: "Tithyareak App",
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App | Case Converter Tool"
        }
      ]
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
      canonical: isDefaultLocale
        ? baseUrl + "/case-convert"
        : `${baseUrl}/${locale}/case-convert`,
      languages: {
        en: `${baseUrl}/en/case-convert`,
        km: `${baseUrl}/case-convert`
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

export default function Home() {
  const t = useTranslations("CaseConverter");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description: t("description"),
    url: "https://next-js-intl.vercel.app/case-converter", // optionally append locale here
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
        <CaseCover />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
