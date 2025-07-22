import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const t = await getTranslations("Homepage");

  return (
    <>
      <h2 className=" text-cyan-500">{t("title")}</h2>
      <p>{t("description")}</p>

      <Image src={"/developer.jpg"} width={200} height={200} alt="image" />
      <Link href={"/language"} className="text-blue-500">
        Click
      </Link>
    </>
  );
}
