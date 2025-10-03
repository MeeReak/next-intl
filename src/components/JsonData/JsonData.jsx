"use client";

import { generateUUID } from "@/util/Helper";
import { useTranslations } from "next-intl";
import React, { useState, useEffect } from "react";

const generateRandomDataFromSchema = (schema, key = "") => {
  if (!schema || typeof schema !== "object") return null;

  if (key.toLowerCase() === "id") return generateUUID();

  switch (schema.type) {
    case "string":
      return Math.random().toString(36).substring(7); // random string
    case "number":
      return Math.floor(Math.random() * 100);
    case "boolean":
      return Math.random() > 0.5;
    case "object": {
      const obj = {};
      if (schema.properties) {
        for (const k of Object.keys(schema.properties)) {
          obj[k] = generateRandomDataFromSchema(schema.properties[k], k);
        }
      }
      return obj;
    }
    case "array": {
      const arr = [];
      const itemSchema = schema.items || { type: "string" };
      const length = Math.floor(Math.random() * 3) + 1; // 1–3 items
      for (let i = 0; i < length; i++) {
        arr.push(generateRandomDataFromSchema(itemSchema));
      }
      return arr;
    }
    default:
      return null;
  }
};

export const JsonData = () => {
  const t = useTranslations("JsonData");
  const [schemaInput, setSchemaInput] = useState("");
  const [sampleData, setSampleData] = useState(null);
  const [error, setError] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    if (!schemaInput.trim()) return;

    try {
      const parsedSchema = JSON.parse(schemaInput);
      const generated = generateRandomDataFromSchema(parsedSchema);
      setSampleData(generated);
      setError(null);
    } catch (err) {
      setError(t("invalid"));
      setSampleData(null);
    }
  }, [schemaInput]);

  const handleCopy = () => {
    if (sampleData) {
      navigator.clipboard
        .writeText(JSON.stringify(sampleData, null, 2))
        .then(() => {
          setCopySuccess(t("copySuccess"));
          setTimeout(() => setCopySuccess(""), 2000);
        })
        .catch(() => setCopySuccess("Failed to copy"));
    }
  };

  return (
    <section className="mx-auto max-w-xl space-y-4 rounded-lg border bg-card p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <header>
        <h1 className="block text-xl font-semibold">{t("inputLabel")}</h1>
      </header>
      <textarea
        className="w-full rounded-md border border-gray-300 dark:border-gray-600 p-2 font-mono text-sm dark:bg-gray-800 dark:text-white"
        rows={7}
        value={schemaInput}
        onChange={(e) => setSchemaInput(e.target.value)}
      />

      <div className=" flex justify-between items-center">
        <div className=" flex gap-x-2 items-center">
          <p className="font-semibold">{t("sampleData")}:</p>{" "}
          {copySuccess && (
            <span className="text-sm text-green-600 dark:text-green-400">
              {copySuccess}
            </span>
          )}
          {error && schemaInput.length !== 0 && (
            <span className="text-sm text-red-600 dark:text-red-500">
              {error}
            </span>
          )}
        </div>
        <div className="flex gap-x-2">
          <button
            onClick={() => {
              setSchemaInput("");
              setSampleData(null);
              setError(null);
              setCopySuccess("");
            }}
            disabled={!schemaInput.trim()}
            className={`px-3 py-1 rounded bg-red-600 text-white ${
              !schemaInput.trim()
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-red-700 cursor-pointer"
            }`}
          >
            {t("clearButton")}
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            disabled={!sampleData}
            className={`px-3 py-1 shadow-md rounded bg-green-600 text-white text-sm ${
              !sampleData
                ? "cursor-not-allowed opacity-50"
                : "hover:bg-green-700 cursor-pointer"
            }`}
          >
            {t("copyData")}
          </button>
        </div>
      </div>
      {sampleData && (
        <pre className="rounded bg-gray-100 p-4 text-sm dark:bg-gray-800 dark:text-gray-200">
          {JSON.stringify(sampleData, null, 2)}
        </pre>
      )}
    </section>
  );
};
