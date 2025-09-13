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
    <Image
      src={langPath}
      width={25}
      height={25}
      alt="image"
      onClick={toggleLocale}
      className=" cursor-pointer"
    />
  );
};
