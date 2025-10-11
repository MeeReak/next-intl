"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gregorianToKhmerLunar } from "@/util/KhmerLunarDate";
import { khDayInWeek } from "@/util/Constant";
import { getDate, getKhmerDate } from "../../util/Helper";
import { Check, Copy } from "lucide-react"; // make sure you have lucide-react installed

export const LunarDate = () => {
  const t = useTranslations("LunarDate");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lunarResult, setLunarResult] = useState(null);
  const [khmerDate, setKhmerDate] = useState("");
  const [DefaultDate, setDefaultDate] = useState("");
  const [copiedButton, setCopiedButton] = useState(""); // track which button was copied

  const handleDateChange = (event) => {
    const dateValue = new Date(event.target.value);
    if (isNaN(dateValue.getTime())) {
      console.warn("Invalid date input:", event.target.value);
      return;
    }
    updateDateResults(dateValue);
  };

  const updateDateResults = (dateValue) => {
    setSelectedDate(dateValue);

    const dd = dateValue.getDate();
    const mm = dateValue.getMonth() + 1;
    const yyyy = dateValue.getFullYear();

    const dayName =
      khDayInWeek[dateValue.toLocaleDateString("en-US", { weekday: "long" })];
    const result = gregorianToKhmerLunar(dd, mm, yyyy);

    setLunarResult({
      dayName,
      ...result
    });

    setKhmerDate(getKhmerDate(dateValue));
    setDefaultDate(getDate(dateValue));
  };

  useEffect(() => {
    updateDateResults(selectedDate);
  }, []);

  const handleCopy = (text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedButton(key);
        setTimeout(() => setCopiedButton(""), 1500);
      })
      .catch(() => {
        console.error("Failed to copy");
      });
  };

  return (
    <section
      aria-labelledby="lunar-date-title"
      className="mx-auto space-y-4 max-w-2xl transition-all rounded-lg border bg-card p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <header className="flex justify-between items-center">
        <h1 id="lunar-date-title" className="block font-semibold text-xl">
          {t("chooseDate")}
        </h1>
      </header>

      <div>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary border-gray-300 dark:border-gray-600 dark:bg-gray-800 font-kantumruy"
        />
      </div>

      {/* Lunar Date */}
      {lunarResult && (
        <div className="flex justify-between items-center">
          <div className="w-[60%] rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground border-gray-300 dark:border-gray-600 dark:bg-gray-800 space-y-2 font-kantumruy">
            <p>
              ថ្ងៃ{lunarResult.dayName} {lunarResult.lunar_day} ខែ
              {lunarResult.lunar_month} ឆ្នាំ{lunarResult.zodiac_year}{" "}
              {lunarResult.stem} ព.ស. {lunarResult.lunar_year}
            </p>
          </div>
          {lunarResult && (
            <button
              onClick={() =>
                handleCopy(
                  `ថ្ងៃ${lunarResult.dayName} ${lunarResult.lunar_day} ខែ${lunarResult.lunar_month} ឆ្នាំ${lunarResult.zodiac_year} ${lunarResult.stem} ព.ស. ${lunarResult.lunar_year}`,
                  "lunar"
                )
              }
              className={`min-w-[120px] whitespace-nowrap py-[7px] text-xs rounded transition-all flex items-center justify-center gap-1 ${
                copiedButton === "lunar"
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {copiedButton === "lunar" ? (
                <div className="flex gap-x-2 items-center">
                  <Check className="size-3" />
                  {t("copySuccess")}
                </div>
              ) : (
                <div className="flex gap-x-2 items-center">
                  <Copy className="size-3" />
                  {t("copyDate")}
                </div>
              )}
            </button>
          )}
        </div>
      )}

      {/* Khmer Date */}
      {khmerDate && (
        <div className="flex justify-between items-center">
          <div className="w-[60%] rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground border-gray-300 dark:border-gray-600 dark:bg-gray-800 space-y-2 font-kantumruy">
            <p>{khmerDate}</p>
          </div>
          <button
            onClick={() => handleCopy(khmerDate, "khmer")}
            className={`min-w-[120px] whitespace-nowrap py-[7px] text-xs rounded transition-all flex items-center justify-center gap-1 ${
              copiedButton === "khmer"
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {copiedButton === "khmer" ? (
              <div className="flex gap-x-2 items-center">
                <Check className="size-3" />
                {t("copySuccess")}
              </div>
            ) : (
              <div className="flex gap-x-2 items-center">
                <Copy className="size-3" />
                {t("copyDate")}
              </div>
            )}
          </button>
        </div>
      )}

      {/* Default Date */}
      {DefaultDate && (
        <div className="flex justify-between items-center">
          <div className="w-[60%] rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground border-gray-300 dark:border-gray-600 dark:bg-gray-800 space-y-2 font-nunito">
            <p>{DefaultDate}</p>
          </div>
          <button
            onClick={() => handleCopy(DefaultDate, "default")}
            className={`min-w-[120px] whitespace-nowrap py-[7px] text-xs rounded transition-all flex items-center justify-center gap-1 ${
              copiedButton === "default"
                ? "bg-green-500 text-white"
                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
            }`}
          >
            {copiedButton === "default" ? (
              <div className="flex gap-x-2 items-center">
                <Check className="size-3" />
                {t("copySuccess")}
              </div>
            ) : (
              <div className="flex gap-x-2 items-center">
                <Copy className="size-3" />
                {t("copyDate")}
              </div>
            )}
          </button>
        </div>
      )}
    </section>
  );
};
