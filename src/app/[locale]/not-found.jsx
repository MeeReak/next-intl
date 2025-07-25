import { getTranslations } from "next-intl/server";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div>
      <h1>{t("title")}</h1>
      <p>{t("description")}</p>
      <a href="/">{t("back")}</a>
    </div>
  );
}
