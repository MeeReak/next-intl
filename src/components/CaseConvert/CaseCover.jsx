"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { CASE_TYPES } from "@/Util/Constant";

const caseTransform = (type, text) => {
  switch (type) {
    case "sentence":
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    case "lower":
      return text.toLowerCase();
    case "upper":
      return text.toUpperCase();
    case "capitalized":
      return text.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    case "alternating":
      return [...text]
        .map((char, i) =>
          i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
        )
        .join("");
    case "title":
      return text.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
    case "inverse":
      return [...text]
        .map((char) =>
          char === char.toLowerCase() ? char.toUpperCase() : char.toLowerCase()
        )
        .join("");
    case "inverse-underscore":
      return text.toUpperCase().replace(/ /g, "_");
    default:
      return text;
  }
};

export const CaseCover = () => {
  const t = useTranslations("CaseConverter");
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");

  const handleCaseChange = (type) => {
    setText(caseTransform(type, originalText));
  };

  const handleTextareaChange = (e) => {
    setText(e.target.value);
    setOriginalText(e.target.value);
  };

  const downloadTextFile = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    character: text.length,
    word: text.trim().split(/\s+/).filter(Boolean).length,
    line: text.split("\n").length
  };

  return (
    <div>
      <div className="p-7 rounded shadow-md max-w-3xl mx-auto border">
        <label htmlFor="case-textarea" className="block font-semibold mb-5">
          {t("inputLabel")}
        </label>
        <textarea
          id="case-textarea"
          rows={5}
          value={text}
          onChange={handleTextareaChange}
          className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        ></textarea>

        <div className="text-sm mt-2">
          {t("stats.character")}: {stats.character} | {t("stats.word")}:{" "}
          {stats.word} | {t("stats.line")}: {stats.line}
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {CASE_TYPES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleCaseChange(key)}
              className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
            >
              {t(label)}
            </button>
          ))}
        </div>

        <div className="flex gap-2 mt-4 flex-wrap">
          <button
            onClick={downloadTextFile}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("download")}
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(text)}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("copy")}
          </button>
          <button
            onClick={() => setText("")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("clear")}
          </button>
        </div>
      </div>
    </div>
  );
};
