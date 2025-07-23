export default async function LanguageSwitchPage() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to switch languages on our website",
    description:
      "A step-by-step guide to change the language on our multilingual site.",
    step: [
      {
        "@type": "HowToStep",
        name: "Open the language menu",
        text: "Look for the language selector in the top-right corner of the page."
      },
      {
        "@type": "HowToStep",
        name: "Select your preferred language",
        text: "Click on the language you want to switch to (e.g., English, Khmer, etc.)."
      },
      {
        "@type": "HowToStep",
        name: "Page will reload",
        text: "The website will reload in your selected language automatically."
      }
    ]
  };

  return (
    <>
      <main>
        <h1>How to Switch Languages</h1>
        <ol>
          <li>Open the language menu</li>
          <li>Select your preferred language</li>
          <li>The page will reload in that language</li>
        </ol>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      </main>
    </>
  );
}
