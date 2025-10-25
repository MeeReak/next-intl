"use client";

import React, { useState, useRef, useCallback } from "react";
import { useTranslations } from "next-intl";
import { CASE_TYPES } from "../../util/Constant";

const caseTransform = (type, text, options = {}) => {
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
    case "random-separator":
      if (!text.trim()) return text;
      // if options.replaceExisting is true, replace existing separators ( _ or - )
      if (options.replaceExisting) {
        // replace any run of _ or - with the provided separator
        return text.replace(/[_-]+/g, options.separator || "_");
      }
      // otherwise replace whitespace
      const separator = options.separator || "_";
      return text.trim().replace(/\s+/g, separator);
    case "no-symbol":
      return text
        .replace(/[^a-zA-Z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
    default:
      return text;
  }
};

export const CaseCover = () => {
  const t = useTranslations("CaseConverter");
  const [text, setText] = useState("");
  const [originalText, setOriginalText] = useState("");
  const [clickedButton, setClickedButton] = useState(null);
  const historyRef = useRef([]);
  const textareaRef = useRef(null);
  const separatorRef = useRef("_"); // current "next" separator; will toggle on click
  const [copiedButton, setCopiedButton] = useState(""); // track which case button was copied

  const pushHistory = useCallback((prev) => {
    if (prev === undefined) return;
    const stack = historyRef.current;
    if (stack.length === 0 || stack[stack.length - 1] !== prev) {
      stack.push(prev);
    }
  }, []);

  const handleCaseChange = (type) => {
    setClickedButton(type); // trigger click effect

    pushHistory(text);

    // Random separator logic
    if (type === "random-separator") {
      const nextSeparator = separatorRef.current === "_" ? "-" : "_";
      let transformed;
      if (/[_-]/.test(text)) {
        transformed = caseTransform("random-separator", text, {
          separator: nextSeparator,
          replaceExisting: true
        });
      } else {
        transformed = caseTransform("random-separator", text, {
          separator: nextSeparator
        });
      }
      separatorRef.current = nextSeparator;
      setText(transformed);
      setOriginalText(transformed);
    } else {
      const transformed = caseTransform(type, text);
      setText(transformed);
      setOriginalText(transformed);
    }

    // Remove click effect after 150ms
    setTimeout(() => setClickedButton(null), 150);
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    pushHistory(text);
    setText(value);
    setOriginalText(value);
  };

  const handleTextareaKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      const prev = historyRef.current.pop();
      if (prev !== undefined) {
        setText(prev);
        setOriginalText(prev);
        requestAnimationFrame(() => {
          const el = textareaRef.current;
          if (el) {
            const pos = prev.length;
            try {
              el.selectionStart = el.selectionEnd = pos;
            } catch {}
          }
        });
      }
    }
  };

  const downloadTextFile = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "case-converted.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    character: text.length,
    word: text.trim() ? text.trim().split(/\s+/).length : 0,
    line: text.split("\n").length
  };

  const handleCopy = (text, key) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopiedButton(key);
        setTimeout(() => setCopiedButton(""), 1500); // reset after 1.5s
      })
      .catch(() => console.error("Failed to copy"));
  };

  return (
    <section
      aria-labelledby="case-convert"
      className="p-6 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-300 bg-white dark:bg-[#121826] dark:border-gray-700 dark:text-white"
    >
      <h1
        id="case-convert"
        className="block font-semibold text-xl mb-5 text-black dark:text-white"
      >
        {t("inputLabel")}
      </h1>

      <textarea
        ref={textareaRef}
        id="case-textarea"
        rows={5}
        value={text}
        onChange={handleTextareaChange}
        onKeyDown={handleTextareaKeyDown}
        spellCheck={true}
        className="w-full border rounded p-3 focus:outline-none focus:ring-1 focus:ring-blue-500
             bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
      />

      <div className="text-sm mt-2 text-black dark:text-white">
        {t("stats.character")}: {stats.character} | {t("stats.word")}:
        {stats.word} | {t("stats.line")}: {stats.line}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {CASE_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleCaseChange(key)}
            disabled={text.trim().length === 0}
            className={`px-3 py-1 shadow-md border font-medium rounded-md transition-colors duration-200
              dark:border-gray-600 dark:bg-gray-900 dark:text-white text-black
              focus:outline-none
              ${
                text.trim().length === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
              }`}
          >
            {t(label)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap">
        <button
          onClick={() => {
            pushHistory(text);
            setText("");
            setOriginalText("");
          }}
          disabled={text.length === 0}
          className={`px-3 py-1 bg-red-500 text-white rounded dark:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-red-400 focus:ring-opacity-50 
            ${
              text.length === 0
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-red-700 cursor-pointer"
            }`}
        >
          {t("clear")}
        </button>
        <button
          onClick={() => handleCopy(text, "copy")}
          disabled={text.length === 0}
          className={`px-3 py-1 min-w-[90px] whitespace-nowrap bg-blue-500 text-white rounded dark:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-opacity-50 
    ${text.length === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700 cursor-pointer"}`}
        >
          {copiedButton === "copy" ? `${t("copySuccess")}` : `${t("copy")}`}
        </button>

        <button
          onClick={downloadTextFile}
          disabled={text.length === 0}
          className={`px-3 py-1 bg-green-500 text-white rounded dark:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-1 focus:ring-green-400 focus:ring-opacity-50 
            ${
              text.length === 0
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-green-700 cursor-pointer"
            }`}
        >
          {t("download")}
        </button>
      </div>
    </section>
  );
};
