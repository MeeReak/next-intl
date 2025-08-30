"use client";
import { forwardRef, useImperativeHandle } from "react";
import jsQR from "jsqr";
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";
import { scanQRCodeInWorker } from "../../util/qrWorkerClient";

// Set up pdf.js worker using modern ESM import
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default forwardRef((_, ref) => {
  useImperativeHandle(ref, () => ({
    async scanFile(fileHandle) {
      const uploadedFile = new Response(fileHandle);

      if (fileHandle.type === "application/pdf") {
        const pdfTypedArray = new Uint8Array(await uploadedFile.arrayBuffer());
        const loadedPDF = await getDocument({ data: pdfTypedArray }).promise;
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

      await page.render({ canvasContext: ctx, viewport }).promise;

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
    const scales = getImageScale(image);

    for (let scale of scales) {
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

function getImageScale(image) {
  const maxDim = Math.max(image.width, image.height);

  if (maxDim <= 500) {
    return [2.7, 2.0, 1.5]; // Small image: upscale to help detection
  } else if (maxDim <= 1000) {
    return [1.0, 0.75]; // Medium image: try normal and slight downscale
  } else {
    return [1.0, 0.75, 0.5]; // Large image: stick to downscaling
  }
}
