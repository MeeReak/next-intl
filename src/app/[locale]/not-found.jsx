import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function NotFoundPage() {
  const t = await getTranslations("notFound");

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-all">
      <h1 className="text-4xl font-semibold dark:text-white mb-5 text-[#10172a]">
        {t("title")}
      </h1>

      <div
        id="four_zero_four_bg"
        className="w-full max-w-md h-80 my-3 rounded-lg shadow-lg overflow-hidden"
      ></div>

      <h2 className="text-base text-gray-800 mb-5 dark:text-gray-200">
        {t("description")}
      </h2>

      <button className="px-5 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
        <Link href="/">{t("back")}</Link>
      </button>
    </div>
  );
}
