export function scanQRCodeInWorker(canvas) {
  return new Promise((resolve, reject) => {
    const ctx = canvas.getContext("2d");
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const worker = new Worker(
      new URL("../workers/qrWorker.js", import.meta.url),
      {
        type: "module"
      }
    );

    worker.onmessage = (e) => {
      const { success, data, error } = e.data;
      if (success) {
        resolve(data);
      } else {
        reject(error);
      }
      worker.terminate();
    };

    worker.onerror = (e) => {
      reject(e.message);
      worker.terminate();
    };

    worker.postMessage({
      imageData,
      width: canvas.width,
      height: canvas.height
    });

    console.log("Scanning QR in Web Worker");
  });
}
