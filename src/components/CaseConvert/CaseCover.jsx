"use client";

import React, { useState, useRef, useCallback } from "react";
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
    case "random-separator": // ✅ new case
      if (!text.trim()) return text;
      const separator = Math.random() < 0.5 ? "_" : "-"; // pick once
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
  const historyRef = useRef([]);
  const textareaRef = useRef(null);
  const pushHistory = useCallback((prev) => {
    if (prev === undefined) return;
    const stack = historyRef.current;
    if (stack.length === 0 || stack[stack.length - 1] !== prev) {
      stack.push(prev);
    }
  }, []);

  const handleCaseChange = (type) => {
    pushHistory(text);
    const transformed = caseTransform(type, originalText);
    setText(transformed);
  };

  const handleTextareaChange = (e) => {
    const value = e.target.value;
    pushHistory(text);
    setText(value);
    setOriginalText(value);
  };

  const handleTextareaPaste = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const pastedText = e.clipboardData.getData("text");
    if (!pastedText) return;

    const el = e.target;
    const start = el.selectionStart ?? text.length;
    const end = el.selectionEnd ?? text.length;

    // record state before paste for undo
    pushHistory(text);

    // insert at caret / replace selection
    const newText = text.slice(0, start) + pastedText + text.slice(end);
    setText(newText);
    setOriginalText(newText);

    // restore caret after React updates
    requestAnimationFrame(() => {
      const pos = start + pastedText.length;
      try {
        el.selectionStart = el.selectionEnd = pos;
      } catch {}
    });
  };

  const handleTextareaKeyDown = (e) => {
    // custom undo so our programmatic changes are undoable
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z") {
      e.preventDefault();
      const prev = historyRef.current.pop();
      if (prev !== undefined) {
        setText(prev);
        setOriginalText(prev);
        // place caret at end (simple + safe)
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
    a.download = "converted-text.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = {
    character: text.length,
    word: text.trim() ? text.trim().split(/\s+/).length : 0,
    line: text.split("\n").length
  };

  return (
    <section
      aria-labelledby="google-len-title"
      className="p-6 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-300 bg-white dark:bg-[#121826] dark:border-gray-700 dark:text-white font-kantumruy"
    >
      <h1
        id="google-len-title"
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
        onPaste={handleTextareaPaste}
        onKeyDown={handleTextareaKeyDown}
        spellCheck={true}
        className="w-full border rounded p-3 focus:outline-none focus:ring-2 focus:ring-blue-500
             bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600"
      />

      <div className="text-sm mt-2 text-black dark:text-white">
        {t("stats.character")}: {stats.character} | {t("stats.word")}:{" "}
        {stats.word} | {t("stats.line")}: {stats.line}
      </div>

      <div className="flex flex-wrap gap-2 mt-4">
        {CASE_TYPES.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => handleCaseChange(key)}
            className="px-4 py-2 shadow-md border dark:border-gray-600 dark:bg-gray-900 dark:text-white text-black font-medium rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {t(label)}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mt-4 flex-wrap ">
        <button
          onClick={() => {
            pushHistory(text);
            setText("");
            setOriginalText("");
          }}
          disabled={text.length === 0}
          className={`px-3 py-1 bg-red-500 text-white rounded dark:bg-red-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 
            ${text.length === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-red-700 cursor-pointer"}`}
        >
          {t("clear")}
        </button>
        <button
          onClick={() => navigator.clipboard.writeText(text)}
          disabled={text.length === 0}
          className={`px-3 py-1 bg-blue-500 text-white rounded dark:bg-blue-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 
            ${text.length === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-blue-700 cursor-pointer"}`}
        >
          {t("copy")}
        </button>

        <button
          onClick={downloadTextFile}
          disabled={text.length === 0}
          className={`px-3 py-1 bg-green-500 text-white rounded dark:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 
            ${text.length === 0 ? "cursor-not-allowed opacity-50" : "hover:bg-green-700 cursor-pointer"}`}
        >
          {t("download")}
        </button>
      </div>
    </section>
  );
};
