"use client";

import React, { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Check, Copy, Moon, Sun } from "lucide-react";
import { PopUp } from "../PopUp";

export const ImageBase64 = () => {
  const t = useTranslations("ImageBase64");
  const [files, setFiles] = useState([]);
  const [showCode, setShowCode] = useState(false);
  const [bgColor, setBgColor] = useState("white");
  const fileInputRef = useRef(null);
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  useEffect(() => {
    let lastPasteTime = 0;
    const handlePaste = (e) => {
      const now = Date.now();
      if (now - lastPasteTime < 1000) {
        e.preventDefault();
        return;
      }
      lastPasteTime = now;

      if (e.clipboardData) {
        const items = e.clipboardData.files;
        if (items.length > 0) handleFiles(items);
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => window.removeEventListener("paste", handlePaste);
  }, []);

  const handleFiles = (selected) => {
    Array.from(selected).forEach((file) => {
      const isImage = file.type.startsWith("image/");

      const fileRecord = {
        id: Date.now() + Math.random(),
        name: file.name,
        size: formatBytes(file.size),
        progress: 0,
        width: null,
        height: null,
        base64: null,
        convertedSize: null,
        tooBig: file.size > MAX_FILE_SIZE,
        statusText: "Converting...",
        isError: false,
        isImage
      };

      setFiles((prev) => [...prev, fileRecord]);

      if (fileRecord.tooBig || !isImage) {
        animateProgress(fileRecord.id, "Error", true);
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64 = reader.result;
        const convertedSize = formatBytes(base64.length * 0.75);
        updateFile(fileRecord.id, { base64, convertedSize });

        const img = new Image();
        img.onload = () => {
          animateProgress(
            fileRecord.id,
            `${img.width} × ${img.height}px`,
            false
          );
          updateFile(fileRecord.id, {
            width: img.width,
            height: img.height
          });
        };
        img.onerror = () => {
          animateProgress(fileRecord.id, "Error", true);
        };
        img.src = base64;
      };
    });
  };

  // Animate bar from 0 → 100 smoothly
  const animateProgress = (id, statusText, isError = false) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 2;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      updateFile(id, { progress, statusText, isError });
    }, 20); // ~2 seconds
  };

  const updateFile = (id, updates) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, ...updates } : f))
    );
  };

  const formatBytes = (bytes, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <section
      aria-labelledby="image-base64-title"
      className="p-6 rounded-xl shadow-md max-w-5xl mx-auto border border-gray-300 bg-white dark:bg-[#121826] dark:border-gray-700 dark:text-white font-kantumruy"
    >
      <header className="flex justify-between items-center mb-4">
        <h1
          id="image-base64-title"
          className="block font-semibold text-xl text-black dark:text-white"
        >
          {t("inputLabel")}
        </h1>
      </header>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="w-full border-2 border-dashed border-blue-400 rounded-xl px-6 py-10 lg:py-16 text-center bg-blue-50 hover:bg-blue-100 dark:bg-blue-950 dark:hover:bg-blue-900 transition-all cursor-pointer"
        role="region"
        aria-describedby="drag-drop-desc"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          id="fileInput"
        />
        <label htmlFor="fileInput" className="cursor-pointer">
          <p
            id="drag-drop-desc"
            className="text-blue-700 dark:text-blue-300 font-medium text-base"
          >
            {t("dragLabel")}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-300 mt-1">
            {t("clickLabel")}
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-300 dark:border-gray-600">
                <th className="p-2">Name</th>
                <th className="p-2">Size</th>
                <th className="p-2">Progress</th>
                <th className="p-2">Converted</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr
                  key={f.id}
                  className="border-b border-gray-200 dark:border-gray-700 h-14"
                >
                  <td className="p-2 max-w-[260px] min-w-[260px] truncate">
                    {f.name}
                  </td>
                  <td className="p-2 min-w-[80px] text-sm">{f.size}</td>
                  <td className="p-2 min-w-[200px]">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded h-6 relative overflow-hidden">
                      <div
                        className={`h-6 rounded transition-all duration-200
        ${
          f.progress < 100
            ? "bg-blue-500" // always blue while loading
            : f.isError || f.tooBig
              ? "bg-red-500" // error after done
              : "bg-green-500" // success after done
        }`}
                        style={{ width: `${f.progress}%` }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center text-white font-medium text-xs">
                        {f.progress < 100
                          ? "Converting..."
                          : f.isError || f.tooBig
                            ? "Error"
                            : f.width && f.height
                              ? `${f.width} × ${f.height} px`
                              : ""}
                      </span>
                    </div>
                  </td>
                  <td className="p-2 text-sm">
                    {f.tooBig || f.isError ? "" : f.convertedSize}
                  </td>
                  <td className="p-2 min-w-[320px]">
                    {f.progress < 100 ? (
                      <span className="text-gray-500 text-xs">
                        Processing...
                      </span>
                    ) : f.tooBig || f.isError ? (
                      <span className="text-red-500 font-medium text-xs">
                        File is too big. Max filesize: 5MiB.
                      </span>
                    ) : (
                      <>
                        <div className="flex gap-2 items-end">
                          {/* Show Code button */}
                          <button
                            disabled={!f.base64}
                            onClick={() => setShowCode(true)}
                            className="whitespace-nowrap px-2 py-1 text-xs rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center transition-colors duration-300 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50"
                          >
                            Show Code
                          </button>

                          {/* Copy Image button */}
                          <button
                            onClick={() => {
                              if (!f.base64) return;
                              copyToClipboard(f.base64);
                              updateFile(f.id, { copiedImage: true });
                              setTimeout(
                                () => updateFile(f.id, { copiedImage: false }),
                                2500
                              );
                            }}
                            disabled={!f.base64}
                            className={`w-[110px] whitespace-nowrap px-2 py-1 text-xs rounded transition-colors duration-300 flex items-center justify-center gap-1 ${
                              f.copiedImage
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            {f.copiedImage ? (
                              "Copied"
                            ) : (
                              <div className="flex gap-x-2 items-center">
                                <Copy className="size-3" /> Copy Image
                              </div>
                            )}
                          </button>

                          {/* Copy CSS button */}
                          <button
                            onClick={() => {
                              if (!f.base64) return;
                              copyToClipboard(
                                `background-image: url('${f.base64}');`
                              );
                              updateFile(f.id, { copiedCss: true });
                              setTimeout(
                                () => updateFile(f.id, { copiedCss: false }),
                                1500
                              );
                            }}
                            disabled={!f.base64}
                            className={`w-[110px] whitespace-nowrap px-2 py-1 text-xs rounded transition-colors duration-300 flex items-center justify-center gap-1 ${
                              f.copiedCss
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                            }`}
                          >
                            {f.copiedCss ? (
                              "Copied"
                            ) : (
                              <div className="flex gap-x-2 items-center">
                                <Copy className="size-3" /> Copy CSS
                              </div>
                            )}
                          </button>
                        </div>

                        {/* Reusable Modal */}
                        <PopUp
                          show={showCode}
                          onClose={() => setShowCode(false)}
                          title="Base64 Code"
                        >
                          <div className="space-y-4">
                            {/* ✅ Preview + Details */}
                            <div className="flex items-start gap-4">
                              <div
                                style={{ backgroundColor: bgColor }}
                                className="w-24 h-24 p-1 rounded-md overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
                              >
                                {f.base64 ? (
                                  <img
                                    src={f.base64}
                                    alt="Preview"
                                    className="object-cover rounded-sm w-full h-full"
                                  />
                                ) : (
                                  <span className="text-xs text-neutral-400">
                                    No Image
                                  </span>
                                )}
                              </div>

                              <ul className="text-xs text-neutral-700 dark:text-neutral-300 space-y-1">
                                <li>
                                  <span className="font-semibold">
                                    Filename:
                                  </span>{" "}
                                  {f.name || "-"}
                                </li>
                                <li>
                                  <span className="font-semibold">
                                    Filesize:
                                  </span>{" "}
                                  {f.size ? f.size : "-"}
                                </li>
                                <li>
                                  <span className="font-semibold">
                                    Encoded:
                                  </span>{" "}
                                  {f.base64 ? "Yes" : "No"}
                                </li>
                                <li>
                                  <span className="font-semibold">Width:</span>{" "}
                                  {f.width || "-"} px
                                </li>
                                <li>
                                  <span className="font-semibold">Height:</span>{" "}
                                  {f.height || "-"} px
                                </li>
                              </ul>
                            </div>

                            <button
                              onClick={() =>
                                setBgColor(
                                  bgColor === "white" ? "black" : "white"
                                )
                              }
                              className={`w-[150px] flex items-center gap-2 px-2 py-1 rounded text-xs font-medium transition-colors duration-200 justify-center ${
                                bgColor === "white"
                                  ? "bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                                  : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                              }`}
                            >
                              {bgColor === "white" ? (
                                <>
                                  <Sun className="w-3 h-3" /> Toggle Background
                                </>
                              ) : (
                                <>
                                  <Moon className="w-3 h-3" /> Toggle Background
                                </>
                              )}
                            </button>

                            <hr className="border-neutral-200 dark:border-neutral-700" />

                            {/* ✅ For <img> Elements */}
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                For use in &lt;img&gt; elements:
                              </p>
                              <div className="flex gap-2">
                                <div className="flex-1 overflow-x-auto rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                  <input
                                    type="text"
                                    readOnly
                                    value={f.base64 || ""}
                                    className="w-full text-xs p-2 bg-transparent outline-none whitespace-nowrap"
                                  />
                                </div>

                                {/* ✅ Copy Button with icon + animation */}
                                <button
                                  onClick={() => {
                                    if (!f.base64) return;
                                    copyToClipboard(f.base64);
                                    updateFile(f.id, { copiedImg: true });
                                    setTimeout(
                                      () =>
                                        updateFile(f.id, { copiedImg: false }),
                                      1500
                                    );
                                  }}
                                  disabled={!f.base64}
                                  className={`w-[110px] whitespace-nowrap px-2 py-1 text-xs rounded transition-colors duration-300 flex items-center justify-center gap-1 ${
                                    f.copiedImg
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                  }`}
                                >
                                  {f.copiedImg ? (
                                    <>
                                      <Check className="size-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3" /> Copy Image
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {/* ✅ For CSS background */}
                            <div className="space-y-2">
                              <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                                For use as CSS background:
                              </p>
                              <div className="flex gap-2">
                                <div className="flex-1 overflow-x-auto rounded border border-neutral-200 dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-800">
                                  <input
                                    type="text"
                                    readOnly
                                    value={
                                      f.base64
                                        ? `background-image: url('${f.base64}');`
                                        : ""
                                    }
                                    className="w-full text-xs p-2 bg-transparent outline-none whitespace-nowrap"
                                  />
                                </div>

                                {/* ✅ Copy Button with icon + animation */}
                                <button
                                  onClick={() => {
                                    if (!f.base64) return;
                                    copyToClipboard(
                                      `background-image: url('${f.base64}');`
                                    );
                                    updateFile(f.id, { copiedCss: true });
                                    setTimeout(
                                      () =>
                                        updateFile(f.id, { copiedCss: false }),
                                      1500
                                    );
                                  }}
                                  disabled={!f.base64}
                                  className={`w-[110px] whitespace-nowrap px-2 py-1 text-xs rounded transition-colors duration-300 flex items-center justify-center gap-1 ${
                                    f.copiedCss
                                      ? "bg-green-500 text-white"
                                      : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
                                  }`}
                                >
                                  {f.copiedCss ? (
                                    <>
                                      <Check className="size-3" /> Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="size-3" /> Copy CSS
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </PopUp>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};
