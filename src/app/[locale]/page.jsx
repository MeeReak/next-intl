import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations("Homepage", locale);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url = locale === "km" ? baseUrl : `${baseUrl}/${locale}`;

  const supportedLocales = ["en", "km"];
  const languageAlternates = Object.fromEntries(
    supportedLocales.map((loc) => [
      loc,
      loc === "km" ? baseUrl : `${baseUrl}/${loc}`
    ])
  );

  return {
    title: t("title"),
    description: t("description"),

    openGraph: {
      title: t("title"),
      description: t("description"),
      url,
      siteName: "Anonymous App",
      locale: locale === "km" ? "km-KH" : "en-US",
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Anonymous App"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "https://profit.pakistantoday.com.pk/wp-content/uploads/2025/04/donkey-donkey-hd-free-download-world-hd-1200x630-cropped.jpg",
          width: 1200,
          height: 630,
          alt: "Anonymous App"
        }
      ]
    },
    alternates: {
      canonical: url,
      languages: {
        ...languageAlternates,
        "x-default": baseUrl
      }
    },
    keywords: [t("title"), t("description"), "Anonymous App", "Useful Tool"],
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
    inLanguage: locale === "km" ? "km-KH" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "Anonymous App"
    }
  };

  return (
    <>
      <main className="p-6 max-w-3xl mx-auto" role="main">
        <header>
          <h1 className="text-cyan-500 text-3xl font-semibold mb-4">
            {t("title")}
          </h1>
          <p className="mb-6">{t("description")}</p>
        </header>

        <section aria-labelledby="developer-section">
          <Image
            src="/developer.jpg"
            width={200}
            height={200}
            alt={t("developerAlt") ?? "Developer working on laptop"}
          />
        </section>

        <nav className="mt-6">
          <Link
            href="/case-convert"
            className="text-blue-500 underline block cursor-pointer"
          >
            {t("linkText") ?? "Try Case Converter Tool"}
          </Link>
        </nav>
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: t("title"),
            description: t("description"),
            url:
              locale === "km"
                ? process.env.NEXT_PUBLIC_SITE_URL
                : `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}`,
            publisher: {
              "@type": "Organization",
              name: "Anonymous App"
            }
          })
        }}
      />
    </>
  );
}
