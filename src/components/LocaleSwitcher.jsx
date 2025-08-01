"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { usePathname } from "../../src/i18n/routing";
import Image from "next/image";

export const LocaleSwitcher = () => {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  let langPath =
    locale === "km" ? "/Flag/UK Circle.png" : "/Flag/KH Circle.png";

  const toggleLocale = () => {
    const newLocale = locale === "km" ? "en" : "km";
    const newPath = `/${newLocale}${pathname}`;
    router.push(newPath);
  };

  return (
    <div className=" fixed right-5 top-5 cursor-pointer" onClick={toggleLocale}>
      <Image src={langPath} width={25} height={25} alt="image" />
    </div>
  );
};
