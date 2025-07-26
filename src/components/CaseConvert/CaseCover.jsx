"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const CaseCover = () => {
  const t = useTranslations("CaseConverter");
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");

  const handleCaseChange = (type) => {
    let newText = originalText;

    switch (type) {
      case "sentence":
        newText =
          newText.charAt(0).toUpperCase() + newText.slice(1).toLowerCase();
        break;
      case "lower":
        newText = newText.toLowerCase();
        break;
      case "upper":
        newText = newText.toUpperCase();
        break;
      case "capitalized":
        newText = newText
          .toLowerCase()
          .replace(/\b\w/g, (char) => char.toUpperCase());
        break;
      case "alternating":
        newText = [...newText]
          .map((char, i) =>
            i % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
          )
          .join("");
        break;
      case "title":
        newText = newText
          .toLowerCase()
          .replace(/\b(\w)/g, (s) => s.toUpperCase());
        break;
      case "inverse":
        newText = [...newText]
          .map((char) =>
            char === char.toLowerCase()
              ? char.toUpperCase()
              : char.toLowerCase()
          )
          .join("");
        break;
      case "inverse-underscore":
        newText = newText.toUpperCase().replace(/ /g, "_");
        break;
      default:
        break;
    }

    setText(newText);
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

  return (
    <div>
      <div className="bg-white p-6 rounded shadow-md max-w-3xl mx-auto">
        <label className="block text-black font-semibold mb-2">
          {t("inputLabel")}
        </label>
        <textarea
          rows={5}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOriginalText(e.target.value);
          }}
          className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        ></textarea>

        <div className="text-sm text-gray-600 mt-2">
          {t("stats.character")}: {text.length} | {t("stats.word")}:{" "}
          {text.trim().split(/\s+/).filter(Boolean).length} | {t("stats.line")}:{" "}
          {text.split("\n").length}
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          <button
            onClick={() => handleCaseChange("sentence")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("sentence")}
          </button>
          <button
            onClick={() => handleCaseChange("lower")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("lower")}
          </button>
          <button
            onClick={() => handleCaseChange("upper")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("upper")}
          </button>
          <button
            onClick={() => handleCaseChange("capitalized")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("capitalized")}
          </button>
          <button
            onClick={() => handleCaseChange("alternating")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("alternating")}
          </button>
          <button
            onClick={() => handleCaseChange("title")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("titleCase")}
          </button>
          <button
            onClick={() => handleCaseChange("inverse")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("inverse")}
          </button>
          <button
            onClick={() => handleCaseChange("inverse-underscore")}
            className="text-black border px-4 py-1 bg-gray-200 rounded-sm"
          >
            {t("inverseUnderscore")}
          </button>
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
