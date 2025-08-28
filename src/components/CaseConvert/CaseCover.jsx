"use client";

import React, { useState, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { CASE_TYPES } from "../../util/Constant";

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
    case "underscore-to-space": // NEW
      return text.replace(/_/g, " ");
    default:
      return text;
  }
};

export const CaseCover = () => {
  const t = useTranslations("CaseConverter");
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const historyRef = useRef([]); // stack for undo

  const pushHistory = (prev) => {
    if (prev !== undefined) historyRef.current.push(prev);
  };

  const handleCaseChange = (type) => {
    setText(caseTransform(type, originalText));
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    pushHistory(text);
    setText(value);
    setOriginalText(value);
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

  // Paste support with history
  useEffect(() => {
    const handlePaste = (e) => {
      const pastedText = e.clipboardData.getData("text");
      if (pastedText) {
        pushHistory(text); // save current state before paste
        setOriginalText(pastedText);
        setText(pastedText);
      }
    };

    const handleUndo = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        const prev = historyRef.current.pop();
        if (prev !== undefined) {
          setText(prev);
          setOriginalText(prev);
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    window.addEventListener("keydown", handleUndo);

    return () => {
      window.removeEventListener("paste", handlePaste);
      window.removeEventListener("keydown", handleUndo);
    };
  }, [text]);

  return (
    <section
      aria-labelledby="google-len-title"
      className="p-6 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white font-kantumruy"
    >
      <h1 id="google-len-title" className="block font-semibold text-xl mb-5">
        {t("inputLabel")}
      </h1>
      <textarea
        id="case-textarea"
        rows={5}
        value={text}
        onChange={handleTextareaChange}
        spellCheck={true}
        className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
             bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
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
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {t(label)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={downloadTextFile}
          className=" px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700 dark:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        >
          {t("download")}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          className=" px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700 dark:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50"
        >
          {t("copy")}
        </button>
        <button
          onClick={() => {
            pushHistory(text);
            setText("");
            setOriginalText("");
          }}
          className=" px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700 dark:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50"
        >
          {t("clear")}
        </button>
      </div>
    </section>
  );
};
