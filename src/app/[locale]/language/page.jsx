import { getTranslations } from "next-intl/server";

export default async function LanguagePage() {
  const t = await getTranslations("Language");

  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: t("title"),
        acceptedAnswer: {
          "@type": "Answer",
          text: t("description")
        }
      },
      {
        "@type": "Question",
        name: "What tools can I use to learn languages?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "You can use our language switcher, lessons, and personalized tips for every skill level."
        }
      }
    ]
  };

  return (
    <>
      <main>
        <h1>{t("title")}</h1>
        <p>{t("description")}</p>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
