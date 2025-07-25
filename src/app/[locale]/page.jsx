import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations("Homepage", locale);

  const baseUrl = "https://next-intl-blackmyth-wukong.vercel.app";
  const url = locale === "km" ? baseUrl : `${baseUrl}/${locale}`;

  return {
    title: t("title"),
    description: t("description"),

    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: "Anonymous App",
      locale: locale === "km" ? "km-KH" : "en-US"
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.jpg"]
    },
    alternates: {
      canonical: url,
      languages: {
        en: `${baseUrl}/en`,
        km: baseUrl
      }
    },
    keywords: [
      "homepage",
      "anonymous app",
      "anonymous",
      "welcome",
      "just click here"
    ],
    robots: {
      index: true,
      follow: true
    }
  };
}

export default async function Home({ params }) {
  const { locale } = await params;
  const t = await getTranslations("Homepage");

  const baseUrl = "https://next-intl-blackmyth-wukong.vercel.app";
  const url = locale === "km" ? baseUrl : `${baseUrl}/${locale}`;

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    url,
    name: t("title"),
    description: t("description"),
    publisher: {
      "@type": "Organization",
      name: "Anonymous App"
    }
  };

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto">
        <h2 className="text-cyan-500 text-3xl font-semibold mb-4">
          {t("title")}
        </h2>
        <p className="mb-6">{t("description")}</p>

        <Image src="/developer.jpg" width={200} height={200} alt={t("title")} />
        <Link
          href="/case-convert"
          className="text-blue-500 underline mt-4 block cursor-pointer"
        >
          {t("linkText")}
        </Link>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
