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

  // async function verifyUrl(url) {
  //   try {
  //     const res = await fetch("/api/scrape-page", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ url })
  //     });
  //     if (!res.ok) throw new Error("Network error");

  //     const data = await res.json();
  //     const text = data.content || "";

  //     if (text.includes("ឃ្យូ.អ.កូដស្តង់ដាត្រឹមត្រូវ")) {
  //       return "valid";
  //     } else if (text.includes("ឯកសារនេះត្រូវបានផុតសុពលភាព")) {
  //       return "expired";
  //     } else {
  //       return "unknown";
  //     }
  //   } catch {
  //     return "error";
  //   }
  // }

  // // Run verification for all scanned QR codes
  // const verifyAllUrls = async (urls) => {
  //   setIsLoading(true);
  //   const statusMap = {};
  //   for (const url of urls) {
  //     statusMap[url] = "loading";
  //     setVerificationStatus({ ...statusMap });
  //     const status = await verifyUrl(url);
  //     statusMap[url] = status;
  //     setVerificationStatus({ ...statusMap });
  //   }
  //   setIsLoading(false);
  // };

  const handleFiles = async (fileList) => {
    const validFiles = Array.from(fileList).filter((file) =>
      allowedTypes.includes(file.type)
    );
    if (validFiles.length !== fileList.length) {
      alert(t("invalidType"));
    }

    if (validFiles.length + files.length > 20) {
      alert(t("fileLimitExceeded"));
      return;
    }

    setIsLoading(true);
    await new Promise((r) => requestAnimationFrame(r));

    const scanResults = await Promise.allSettled(
      validFiles.map(async (file) => {
        const data = await scannerRef.current.scanFile(file);

        let status = "unknown";

        if (data) {
          try {
            const res = await fetch("/api/scrape-page", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ url: data })
            });

            const result = await res.json();
            if (res.ok && result.content) {
              if (result.content.includes("ឯកសារនេះត្រូវបានផុតសុពលភាព")) {
                status = "expired";
              } else if (
                result.content.includes("ឃ្យូ.អ.កូដស្តង់ដាត្រឹមត្រូវ")
              ) {
                status = "valid";
              }
            }
          } catch (err) {
            console.error("Validation failed", err);
          }
        }

        return {
          file,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
          data,
          status
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
        newResults.push({
          url: res.value.data || null,
          status: res.value.status || "unknown"
        });
      } else {
        newPreviews.push({ file: res.reason.file || null, previewUrl: null });
        newResults.push({ url: null, status: "unknown" });
      }
    });

    setFiles((prev) => [...prev, ...newPreviews.map((p) => p.file)]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setQrResults((prev) => [...prev, ...newResults]);

    // console.log("TotalScanTime:", performance.now().toFixed(), "ms");
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
          {t("inputLabel")}
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
        className="w-full border-2 border-dashed border-blue-400 rounded-xl px-6 py-16 text-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 transition-all cursor-pointer"
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
          {[...previews].reverse().map(({ file, previewUrl }, index) => {
            const reversedIndex = previews.length - 1 - index;
            const { url, status } = qrResults[reversedIndex] || {};

            let bgColorClass = "bg-gray-100 dark:bg-gray-800"; // default
            if (status === "valid")
              bgColorClass = "bg-green-100 dark:bg-green-900";
            else if (status === "expired")
              bgColorClass = "bg-red-100 dark:bg-red-900";

            return (
              <li
                key={reversedIndex}
                className={`flex flex-col gap-2 border rounded px-3 py-2 border-gray-300 dark:border-gray-700 ${bgColorClass}`}
                tabIndex={0}
                aria-label={`${file.name} ${
                  url
                    ? status === "valid"
                      ? t("qrCodeValid")
                      : t("qrCodeExpired")
                    : t("noQRFound")
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="truncate">{file.name}</div>
                  <button
                    onClick={() => removeFile(reversedIndex)}
                    className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    aria-label={t("removeFile", { fileName: file.name })}
                  >
                    {t("remove")}
                  </button>
                </div>

                {url ? (
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-700 dark:text-blue-300 underline break-all"
                  >
                    {url}
                  </a>
                ) : (
                  <span className="text-gray-400 italic text-sm">
                    {t("noQRFound")}
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <QrScanner ref={scannerRef} />
    </section>
  );
};
