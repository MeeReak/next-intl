import React from "react";
import { getTranslations } from "next-intl/server";
import Head from "next/head";

export default async function LanguageSwitcher() {
  const t = await getTranslations("Language");

  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: t("title"),
    description: t("description")
  };

  return (
    <>
      <Head>
        <title>{t("title")}</title>
        <meta name="description" content={t("description")} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>

      <main>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
      </main>
    </>
  );
}
