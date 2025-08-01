import { GoogleLen } from "@/components/GooogleLen/GoogleLen";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const baseUrl = "https://next-intl-blackmyth-wukong.vercel.app";
  const isDefaultLocale = locale === "km";

  return {
    title: t("GoogleLen.title"),
    description: t("GoogleLen.description"),
    openGraph: {
      title: t("GoogleLen.title"),
      description: t("GoogleLen.description"),
      url: isDefaultLocale
        ? baseUrl + "/google-len"
        : `${baseUrl}/${locale}/google-len`,
      type: "website",
      locale: locale === "km" ? "km-KH" : "en-US",
      siteName: "Tithyareak App",
      images: [
        {
          url: `${baseUrl}/og-image-googlelen.jpg`,
          width: 1200,
          height: 630,
          alt: "Tithyareak App | GoogleLen QR Code Scanner Tool"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("GoogleLen.title"),
      description: t("GoogleLen.description"),
      images: [`${baseUrl}/og-image-googlelen.jpg`]
    },
    alternates: {
      canonical: isDefaultLocale
        ? baseUrl + "/google-len"
        : `${baseUrl}/${locale}/google-len`,
      languages: {
        en: `${baseUrl}/en/google-len`,
        km: `${baseUrl}/google-len`
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
  const t = useTranslations("GoogleLen");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description: t("description"),
    url: "https://next-intl-blackmyth-wukong.vercel.app/google-len",
    author: {
      "@type": "Organization",
      name: "Tithyareak App",
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
        <GoogleLen />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
