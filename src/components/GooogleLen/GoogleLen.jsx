"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { BrowserQRCodeReader } from "@zxing/browser";

export const GoogleLen = () => {
  const t = useTranslations("GoogleLen");
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [qrResults, setQrResults] = useState([]);

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

    const filePreviews = await Promise.all(
      validFiles.map(async (file) => {
        let previewUrl = null;
        let qrResult = null;

        if (file.type.startsWith("image/")) {
          previewUrl = URL.createObjectURL(file);
          const img = await loadImage(previewUrl);
          qrResult = await scanImageForQR(img);
        }

        if (qrResult) {
          setQrResults((prev) => [...prev, qrResult]);
        } else {
          setQrResults((prev) => [...prev, null]);
        }

        return { file, previewUrl };
      })
    );

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...filePreviews]);
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = url;
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = reject;
    });
  };

  const scanImageForQR = async (img) => {
    try {
      const codeReader = new BrowserQRCodeReader();
      const result = await codeReader.decodeFromImageElement(img);
      return result?.getText() || null;
    } catch (err) {
      return null;
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = e.dataTransfer.files;
    if (droppedFiles.length > 0) handleFiles(droppedFiles);
  };

  const handleInputChange = (e) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) handleFiles(selectedFiles);
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

      {previews.length > 0 && (
        <ul className="mt-6 w-full space-y-4" aria-live="polite">
          {previews.map(({ file }, index) => (
            <li
              key={index}
              className="flex flex-col gap-2 border border-gray-300 dark:border-gray-700 rounded px-3 py-2"
              tabIndex={0}
              aria-label={`${file.name} ${qrResults[index] ? t("qrCodeFound") : t("noQRFound")}`}
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
    </section>
  );
};
