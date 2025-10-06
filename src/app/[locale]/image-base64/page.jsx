import { ImageBase64 } from "@/components/ImageBase64/ImageBase64";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const baseUrl = "https://next-js-intl.vercel.app";
  const isDefaultLocale = locale === "km";

  return {
    title: t("ImageBase64.title"),
    description: t("ImageBase64.description"),
    openGraph: {
      title: t("ImageBase64.title"),
      description: t("ImageBase64.description"),
      url: isDefaultLocale
        ? baseUrl + "/image-base64"
        : `${baseUrl}/${locale}/image-base64`,
      type: "website",
      locale: locale === "km" ? "km-KH" : "en-US",
      siteName: "Tithyareak App",
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Tithyareak App | ImageBase64 QR Code Scanner Tool"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("ImageBase64.title"),
      description: t("ImageBase64.description"),
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
        ? baseUrl + "/image-base64"
        : `${baseUrl}/${locale}/image-base64`,
      languages: {
        en: `${baseUrl}/en/image-base64`,
        km: `${baseUrl}/image-base64`
      }
    },
    keywords: [
      "image base64",
      "image transformer",
      "base64",
      "image",
      "free tool"
    ],
    robots: {
      index: true,
      follow: true
    }
  };
}

export default function Page() {
  const t = useTranslations("ImageBase64");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: t("title"),
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "All",
    description: t("description"),
    url: "https://next-js-intl.vercel.app/image-base64",
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
        <h1 className="lg:text-3xl text-2xl font-bold text-center mb-4">
          {t("title")}
        </h1>
        <ImageBase64 />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
