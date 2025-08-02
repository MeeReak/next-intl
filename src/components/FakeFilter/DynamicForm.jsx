"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Photo_Base64 } from "../../util/Constant";

export const DynamicForm = () => {
  const t = useTranslations("FakeFilter");

  const [recipientFields, setRecipientFields] = useState([
    { field: "", type: "string" }
  ]);
  const [certificateFields, setCertificateFields] = useState([
    { field: "", type: "string" }
  ]);
  const [generatedSchema, setGeneratedSchema] = useState(null);
  const [sampleData, setSampleData] = useState(null);
  const [copySuccess, setCopySuccess] = useState("");

  const addRecipientField = () => {
    setRecipientFields([...recipientFields, { field: "", type: "string" }]);
  };

  const removeRecipientField = (index) => {
    setRecipientFields(recipientFields.filter((_, i) => i !== index));
  };

  const addCertificateField = () => {
    setCertificateFields([...certificateFields, { field: "", type: "string" }]);
  };

  const removeCertificateField = (index) => {
    setCertificateFields(certificateFields.filter((_, i) => i !== index));
  };

  const generateUUID = () =>
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0,
        v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });

  const randomString = () => {
    const names = ["John Doe", "Jane Smith", "Alex Johnson", "Emily Brown"];
    const khmerNames = ["ជន ដូ", "ជេន ស្មិច", "អេលិច ស៍", "អេមី ប្រោន"];
    return {
      en: names[Math.floor(Math.random() * names.length)],
      km: khmerNames[Math.floor(Math.random() * khmerNames.length)]
    };
  };

  const randomDate = () => {
    const start = new Date(2015, 0, 1);
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString().slice(0, 10);
  };

  const randomLastTime = () => {
    // Example: ISO string with time and date
    const start = new Date(2015, 0, 1);
    const end = new Date();
    const date = new Date(
      start.getTime() + Math.random() * (end.getTime() - start.getTime())
    );
    return date.toISOString();
  };

  // We'll just stub khmer lunar and khmer date with a string indicating type (because they are complex)
  const khmerLunarDateSample = "1st Waxing of Kason 2569 BE";
  const khmerDateSample = "15 April 2569 BE";

  const generateSampleValue = (fieldName, type, rootId) => {
    if (fieldName.toLowerCase() === "id") {
      return rootId;
    }
    switch (type) {
      case "string":
        if (fieldName.toLowerCase().includes("namekm"))
          return randomString().km;
        if (fieldName.toLowerCase().includes("name")) return randomString().en;
        if (fieldName.toLowerCase().includes("staffno"))
          return "S" + Math.floor(100000 + Math.random() * 900000).toString();
        return "Sample Text";

      case "PhotoBase64":
        return Photo_Base64;

      case "Khmer lunar date":
        return khmerLunarDateSample;

      case "Khmer date":
        return khmerDateSample;

      case "date":
        return randomDate();

      case "last time":
        return randomLastTime();

      default:
        return null;
    }
  };

  const handleGenerate = () => {
    const schema = {
      type: "object",
      required: ["id", "recipient", "certificate"],
      properties: {
        id: { type: "string" },
        recipient: {
          type: "object",
          required: recipientFields.map((f) => f.field).filter(Boolean),
          properties: {}
        },
        certificate: {
          type: "object",
          required: [
            "institution",
            "institutionKm",
            ...certificateFields.map((f) => f.field).filter(Boolean)
          ],
          properties: {
            institution: { type: "string" },
            institutionKm: { type: "string" }
          }
        }
      }
    };

    recipientFields.forEach((f) => {
      if (f.field) {
        schema.properties.recipient.properties[f.field] = { type: f.type };
      }
    });

    certificateFields.forEach((f) => {
      if (f.field) {
        schema.properties.certificate.properties[f.field] = { type: f.type };
      }
    });

    setGeneratedSchema(schema);

    const rootId = generateUUID();
    const sample = {
      id: rootId,
      recipient: {},
      certificate: {
        institution: "Harverd School",
        institutionKm: "Harverd School"
      }
    };

    recipientFields.forEach((f) => {
      if (f.field) {
        sample.recipient[f.field] = generateSampleValue(
          f.field,
          f.type,
          rootId
        );
      }
    });

    certificateFields.forEach((f) => {
      if (f.field) {
        sample.certificate[f.field] = generateSampleValue(
          f.field,
          f.type,
          rootId
        );
      }
    });

    setSampleData(sample);
    setCopySuccess("");
  };

  const hasEmptyFields =
    recipientFields.some((f) => !f.field.trim()) ||
    certificateFields.some((f) => !f.field.trim());

  return (
    <div className="space-y-6">
      {/* Recipient Section */}
      <section className="p-6 border rounded-xl bg-white dark:bg-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t("recipientTitle")}</h2>
          <button
            onClick={addRecipientField}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("addButton")}
          </button>
        </div>
        {recipientFields.map((field, index) => (
          <div key={index} className="flex gap-3 items-center mb-2">
            <input
              type="text"
              placeholder="Field name"
              value={field.field}
              onChange={(e) => {
                const updated = [...recipientFields];
                updated[index].field = e.target.value;
                setRecipientFields(updated);
              }}
              className="flex-1 p-2 border rounded"
            />
            <select
              value={field.type}
              onChange={(e) => {
                const updated = [...recipientFields];
                updated[index].type = e.target.value;
                setRecipientFields(updated);
              }}
              className="w-48 p-2 border rounded"
            >
              <option value="string">string</option>
              <option value="PhotoBase64">PhotoBase64</option>
              <option value="Khmer lunar date">Khmer lunar date</option>
              <option value="Khmer date">Khmer date</option>
              <option value="date">date</option>
              <option value="last time">last time</option>
            </select>
            <button
              onClick={() => removeRecipientField(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t("removeButton")}
            </button>
          </div>
        ))}
      </section>

      {/* Certificate Section */}
      <section className="p-6 border rounded-xl bg-white dark:bg-gray-900 dark:text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{t("certificateTitle")}</h2>
          <button
            onClick={addCertificateField}
            className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {t("addButton")}
          </button>
        </div>
        {certificateFields.map((field, index) => (
          <div key={index} className="flex gap-3 items-center mb-2">
            <input
              type="text"
              placeholder="Field name"
              value={field.field}
              onChange={(e) => {
                const updated = [...certificateFields];
                updated[index].field = e.target.value;
                setCertificateFields(updated);
              }}
              className="flex-1 p-2 border rounded"
            />
            <select
              value={field.type}
              onChange={(e) => {
                const updated = [...certificateFields];
                updated[index].type = e.target.value;
                setCertificateFields(updated);
              }}
              className="w-48 p-2 border rounded"
            >
              <option value="string">string</option>
              <option value="PhotoBase64">PhotoBase64</option>
              <option value="Khmer lunar date">Khmer lunar date</option>
              <option value="Khmer date">Khmer date</option>
              <option value="date">date</option>
              <option value="last time">last time</option>
            </select>
            <button
              onClick={() => removeCertificateField(index)}
              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              {t("removeButton")}
            </button>
          </div>
        ))}
      </section>

      {/* Buttons Row */}
      <div className="flex gap-3 justify-between">
        <div className="flex gap-3">
          <button
            onClick={() => {
              if (!generatedSchema) return;
              navigator.clipboard.writeText(
                JSON.stringify(generatedSchema, null, 2)
              );
              setCopySuccess(t("copySchemaSuccess"));
              setTimeout(() => setCopySuccess(""), 2000);
            }}
            disabled={!generatedSchema}
            className={`px-4 py-2 rounded ${
              generatedSchema
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {t("copyJson")}
          </button>
          <button
            onClick={() => {
              if (!sampleData) return;
              navigator.clipboard.writeText(
                JSON.stringify(sampleData, null, 2)
              );
              setCopySuccess(t("copySampleSuccess"));
              setTimeout(() => setCopySuccess(""), 2000);
            }}
            disabled={!sampleData}
            className={`px-4 py-2 rounded ${
              sampleData
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-gray-400 text-gray-700 cursor-not-allowed"
            }`}
          >
            {t("copyData")}
          </button>

          {/* Copy Success Message */}
          {copySuccess && (
            <div className="mt-2 text-sm text-green-600 dark:text-green-400">
              {copySuccess}
            </div>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleGenerate}
            disabled={hasEmptyFields}
            className={`px-4 py-2 rounded ${
              hasEmptyFields
                ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {t("generateButton")}
          </button>

          <button
            onClick={() => {
              setRecipientFields([{ field: "", type: "string" }]);
              setCertificateFields([{ field: "", type: "string" }]);
              setGeneratedSchema(null);
              setSampleData(null);
              setCopySuccess("");
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            {t("clearButton")}
          </button>
        </div>
      </div>

      <div className="flex justify-between">
        {/* Output */}
        {generatedSchema && (
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded text-sm font-mono overflow-x-auto text-black dark:text-white border">
            <h3 className="mb-2 font-semibold">{t("generatedSchema")}:</h3>
            <pre>{JSON.stringify(generatedSchema, null, 2)}</pre>
          </div>
        )}

        {sampleData && (
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded text-sm font-mono overflow-x-auto text-black dark:text-white border">
            <h3 className="mb-2 font-semibold">{t("sampleData")}:</h3>
            <pre>{JSON.stringify(sampleData, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};
