import React from "react";
import { LocaleSwitcher } from "./LocaleSwitcher";
import ThemeToggle from "./ThemeSwitcher";

export const LocaleTheme = () => {
  return (
    <div className=" flex gap-x-2 lg:gap-x-3 fixed right-5 top-8">
      <LocaleSwitcher />
      <ThemeToggle />
    </div>
  );
};
