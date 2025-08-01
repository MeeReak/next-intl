"use client";
import { forwardRef, useImperativeHandle } from "react";
import jsQR from "jsqr";
import * as pdfjsLib from "pdfjs-dist";
import { scanQRCodeInWorker } from "../../Util/qrWorkerClient";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

export default forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    async scanFile(fileHandle) {
      const uploadedFile = new Response(fileHandle);

      if (fileHandle.type === "application/pdf") {
        const pdfTypedArray = new Uint8Array(await uploadedFile.arrayBuffer());
        const loadedPDF = await pdfjsLib.getDocument(pdfTypedArray).promise;
        return await renderPDF(loadedPDF);
      } else {
        const imageBlob = await uploadedFile.blob();
        return await renderImage(imageBlob);
      }
    }
  }));

  function createCanvas(width, height) {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  async function renderPDF(pdf) {
    let qrResult = null;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const scale = 1.5;
      const viewport = page.getViewport({ scale });

      const canvas = createCanvas(viewport.width, viewport.height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      const renderContext = { canvasContext: ctx, viewport };
      await page.render(renderContext).promise;

      qrResult = await scanQRCodeInWorker(canvas);
      if (qrResult) return qrResult;
    }

    return null;
  }

  function generateImageObject(blob) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(blob);
    });
  }

  async function renderImage(blob) {
    const image = await generateImageObject(blob);

    for (let scale of [1, 0.75, 0.5]) {
      const canvas = createCanvas(image.width * scale, image.height * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

      const result = extractQRCode(canvas);
      if (result) return result;
    }

    return null;
  }

  function extractQRCode(canvas) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth"
    });
    return code?.data || null;
  }

  return null; // No visible output
});
