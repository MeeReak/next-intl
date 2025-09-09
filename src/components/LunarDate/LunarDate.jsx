"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { gregorianToKhmerLunar } from "@/util/KhmerLunarDate";
import { khDayInWeek } from "@/util/Constant";
import { getDate, getKhmerDate } from "@/util/Helper";

export const LunarDate = () => {
  const t = useTranslations("LunarDate");

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [lunarResult, setLunarResult] = useState(null);
  const [khmerDate, setKhmerDate] = useState("");
  const [DefaultDate, setDefaultDate] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  const handleDateChange = (event) => {
    const dateValue = new Date(event.target.value);
    if (isNaN(dateValue.getTime())) {
      console.warn("Invalid date input:", event.target.value);
      return;
    }
    updateDateResults(dateValue);
  };

  // Extract the logic to update results into a function
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

  // Run once on component mount
  useEffect(() => {
    updateDateResults(selectedDate);
  }, []);

  // Copy function remains the same
  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopySuccess(t("copySuccess"));
        setTimeout(() => setCopySuccess(""), 2000);
      })
      .catch(() => {
        setCopySuccess("Failed to copy");
        setTimeout(() => setCopySuccess(""), 2000);
      });
  };

  return (
    <section
      aria-labelledby="lunar-date-title"
      className="mx-auto space-y-4 max-w-xl rounded-lg border bg-card p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      <header className=" flex justify-between items-center">
        <h1
          id="lunar-date-title"
          className="text-lg font-semibold tracking-tight"
        >
          {t("chooseDate")}
        </h1>

        {/* Copy Success Message */}
        {copySuccess && (
          <span className="text-sm text-green-600 dark:text-green-400">
            {copySuccess}
          </span>
        )}
      </header>

      <div>
        <input
          type="date"
          value={selectedDate.toISOString().split("T")[0]}
          onChange={handleDateChange}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary dark:border-gray-700 dark:bg-gray-800"
        />
      </div>

      {lunarResult && (
        <div className="flex justify-between items-center">
          <div className="w-[75%] rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground dark:border-gray-700 dark:bg-gray-800 space-y-2 font-kantumruy">
            <p>
              ថ្ងៃ{lunarResult.dayName} {lunarResult.lunar_day} ខែ
              {lunarResult.lunar_month} ឆ្នាំ{lunarResult.zodiac_year}{" "}
              {lunarResult.stem} ព.ស. {lunarResult.lunar_year}
            </p>
          </div>
          <button
            onClick={() =>
              handleCopy(
                `ថ្ងៃ${lunarResult.dayName} ${lunarResult.lunar_day} ខែ${lunarResult.lunar_month} ឆ្នាំ${lunarResult.zodiac_year} ${lunarResult.stem} ព.ស. ${lunarResult.lunar_year}`
              )
            }
            className="px-3 py-1 shadow-md rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer text-sm"
          >
            {t("copyDate")}
          </button>
        </div>
      )}
      {khmerDate && (
        <div className="flex justify-between items-center">
          <div className="w-[75%] rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground dark:border-gray-700 dark:bg-gray-800 space-y-2 font-kantumruy">
            <p>{khmerDate}</p>
          </div>
          <button
            onClick={() => handleCopy(khmerDate)}
            className="px-3 py-1 shadow-md rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer text-sm"
          >
            {t("copyDate")}
          </button>
        </div>
      )}

      {DefaultDate && (
        <div className="flex justify-between items-center">
          <div className="w-[75%] rounded-md border bg-muted/30 px-3 py-2 text-sm text-foreground dark:border-gray-700 dark:bg-gray-800 space-y-2 font-kantumruy">
            <p>{DefaultDate}</p>
          </div>
          <button
            onClick={() => handleCopy(DefaultDate)}
            className="px-3 py-1 shadow-md rounded bg-green-600 text-white hover:bg-green-700 cursor-pointer text-sm"
          >
            {t("copyDate")}
          </button>
        </div>
      )}
    </section>
  );
};
