importScripts("https://cdn.jsdelivr.net/npm/jsqr/dist/jsQR.min.js");

self.onmessage = function (event) {
  const { imageData, width, height } = event.data;

  try {
    const code = jsQR(imageData.data, width, height, {
      inversionAttempts: "attemptBoth"
    });

    self.postMessage({ success: true, data: code?.data || null });
  } catch (error) {
    self.postMessage({ success: false, error: error.message });
  }
};
