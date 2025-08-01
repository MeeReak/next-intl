"use client";

import React, { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import dynamic from "next/dynamic";
const QrScanner = dynamic(() => import("./QrScanner"), { ssr: false });

export const GoogleLen = () => {
  const t = useTranslations("GoogleLen");
  const scannerRef = useRef();

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [qrResults, setQrResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "application/pdf"
  ];

  const handleFiles = async (fileList) => {
    const validFiles = Array.from(fileList).filter((file) =>
      allowedTypes.includes(file.type)
    );
    if (validFiles.length !== fileList.length) {
      alert(t("invalidType"));
    }

    setIsLoading(true);
    await new Promise((r) => requestAnimationFrame(r));

    const scanResults = await Promise.allSettled(
      validFiles.map(async (file) => {
        const start = performance.now();
        const data = await scannerRef.current.scanFile(file);
        const end = performance.now();
        return {
          file,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
          data
        };
      })
    );

    const newPreviews = [];
    const newResults = [];

    scanResults.forEach((res) => {
      if (res.status === "fulfilled") {
        newPreviews.push({
          file: res.value.file,
          previewUrl: res.value.previewUrl
        });
        newResults.push(res.value.data || null);
      } else {
        console.error("Scan failed:", res.reason);
        newPreviews.push({ file: res.reason.file || null, previewUrl: null });
        newResults.push(null);
      }
    });

    setFiles((prev) => [...prev, ...newPreviews.map((p) => p.file)]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setQrResults((prev) => [...prev, ...newResults]);

    console.log("TotalScanTime:", performance.now().toFixed(), "ms");
    setIsLoading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const dropped = e.dataTransfer.files;
    if (dropped.length > 0) handleFiles(dropped);
  };

  const handleInputChange = (e) => {
    const selected = e.target.files;
    if (selected && selected.length > 0) handleFiles(selected);
  };

  const resetFiles = () => {
    setFiles([]);
    setPreviews([]);
    setQrResults([]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setQrResults((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <section
      aria-labelledby="google-len-title"
      className="p-6 rounded-xl shadow-md max-w-3xl mx-auto border border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white font-kantumruy"
    >
      <header className="flex justify-between items-center mb-4">
        <h1 id="google-len-title" className="block font-semibold text-xl">
          {t("description")}
        </h1>
        {files.length > 0 && (
          <button
            onClick={resetFiles}
            className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            aria-label={t("clearFiles")}
          >
            {t("clear")}
          </button>
        )}
      </header>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full border-2 border-dashed border-blue-400 rounded-xl p-6 text-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 transition-all cursor-pointer"
        role="region"
        aria-describedby="drag-drop-desc"
      >
        <input
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleInputChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer" tabIndex={0}>
          <p
            id="drag-drop-desc"
            className="text-blue-700 dark:text-blue-300 font-medium text-lg"
          >
            {t("dragLabel")}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-300 mt-1">
            {t("clickLabel")}
          </p>
        </label>
      </div>

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          className="mt-4 flex items-center justify-center text-blue-600 dark:text-blue-300"
        >
          <svg
            className="animate-spin mr-2 h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3-3-3h4z"
            />
          </svg>
          <span className="text-sm">{t("processing") || "Processing..."}</span>
        </div>
      )}

      {previews.length > 0 && (
        <ul className="mt-6 w-full space-y-4" aria-live="polite">
          {previews.map(({ file, previewUrl }, index) => (
            <li
              key={index}
              className="flex flex-col gap-2 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
              tabIndex={0}
              aria-label={`${file.name} ${
                qrResults[index] ? t("qrCodeFound") : t("noQRFound")
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="truncate">{file.name}</div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  aria-label={t("removeFile", { fileName: file.name })}
                >
                  {t("remove")}
                </button>
              </div>

              {qrResults[index] ? (
                <a
                  href={qrResults[index]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 underline break-all"
                >
                  {qrResults[index]}
                </a>
              ) : (
                <span className="text-gray-400 italic text-sm">
                  {t("noQRFound")}
                </span>
              )}
            </li>
          ))}
        </ul>
      )}

      <QrScanner ref={scannerRef} />
    </section>
  );
};
