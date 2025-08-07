"use client";

import { useState } from "react";

export default function QRContentExtractor() {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const qrUrl =
    "https://verify.gov.kh/verify/5-UVL3fLgGfRnINMa_ynKqBFwklDa6mt?key=d06e7da7960ddef905edde88f7340fbb88f7643730077ef47aa4314b90a99e9a";

  const handleExtract = async () => {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/scrape-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: qrUrl })
      });

      const data = await res.json();
      if (res.ok) {
        setResult(data.content);
      } else {
        setResult(data.error || "Unknown error");
      }
    } catch (err) {
      setResult("Error fetching content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleExtract} disabled={loading}>
        {loading ? "Extracting..." : "Extract QR Content"}
      </button>
      <p>{result}</p>
    </div>
  );
}
