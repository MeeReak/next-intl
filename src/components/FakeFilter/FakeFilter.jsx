"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { DynamicForm } from "./DynamicForm";

export const FakeFilter = () => {
  const t = useTranslations("FakeFilter");

  return (
    <section
      aria-labelledby="google-len-title"
      className="p-6 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white font-kantumruy"
    >
      <header className="flex justify-between items-center mb-4">
        <h1 id="google-len-title" className="block font-semibold text-xl">
          {t("inputLabel")}
        </h1>
      </header>
      <DynamicForm />
    </section>
  );
};
