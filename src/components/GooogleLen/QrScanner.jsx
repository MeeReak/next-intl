"use client";
import React, { useRef, forwardRef, useImperativeHandle } from "react";
import jsQR from "jsqr";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

export default forwardRef((_, ref) => {
  const canvasRef = useRef();

  useImperativeHandle(ref, () => ({
    async scanFile(FileHandle) {
      const uploadedFile = new Response(FileHandle);
      if (FileHandle.type === "application/pdf") {
        const pdfTypedArray = new Uint8Array(await uploadedFile.arrayBuffer());
        const loadedPDF = await pdfjsLib.getDocument(pdfTypedArray).promise;
        return await renderPDF(loadedPDF);
      } else {
        const imageBlob = await uploadedFile.blob();
        return await renderImage(imageBlob);
      }
    }
  }));

  async function renderPDF(pdfTypedArray) {
    let qrResult = null;
    for (
      let pageToRender = 1;
      pageToRender <= pdfTypedArray.numPages;
      pageToRender++
    ) {
      const page = await pdfTypedArray.getPage(pageToRender);
      const canvas = canvasRef.current;
      canvas.height = 3508;
      canvas.width = 2480;

      const unscaledViewport = page.getViewport({ scale: 1 });
      const scale = Math.min(
        canvas.height / unscaledViewport.height,
        canvas.width / unscaledViewport.width
      );
      const viewport = page.getViewport({ scale });

      const renderContext = {
        canvasContext: canvas.getContext("2d"),
        viewport
      };

      await page.render(renderContext).promise;

      qrResult = extractQRCode(canvas);
      if (qrResult) return qrResult;
    }
    return null;
  }

  function generateImageObject(imageBlob) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = URL.createObjectURL(imageBlob);
    });
  }

  async function renderImage(imageBlob) {
    const image = await generateImageObject(imageBlob);
    const canvas = canvasRef.current;

    for (let scale of [0.5, 1, 0.25]) {
      canvas.height = image.height * scale;
      canvas.width = image.width * scale;

      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const result = extractQRCode(canvas);
      if (result) return result;
    }

    return null;
  }

  function extractQRCode(canvas) {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrData = jsQR(imageData.data, canvas.width, canvas.height, {
      inversionAttempts: "attemptBoth"
    });
    return qrData?.data || null;
  }

  return (
    <div style={{ display: "none" }}>
      <canvas ref={canvasRef} />
    </div>
  );
});
