import { getTranslations } from "next-intl/server";
import Head from "next/head";

export default async function Language() {
  const t = await getTranslations("Language");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "LanguagePage",
    headline: t("title"),
    description: t("description")
  };

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("excerpt")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </Head>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
    </>
  );
}
