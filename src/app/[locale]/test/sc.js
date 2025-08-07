const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

(async () => {
  try {
    const url =
      "https://verify.gov.kh/verify/5-UVL3fLgGfRnINMa_ynKqBFwklDa6mt?key=d06e7da7960ddef905edde88f7340fbb88f7643730077ef47aa4314b90a99e9a";

    const browser = await puppeteer.launch({
      headless: false, // non-headless so you can see browser & debug
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      defaultViewport: null // full size window
    });

    const page = await browser.newPage();

    // Set user agent to a normal browser UA string
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    // Set accept-language headers (optional but recommended)
    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9"
    });

    // Go to the URL and wait until network is idle
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });

    // Wait until the element exists and has text content (adjust selector if needed)
    await page.waitForFunction(
      () => {
        const el = document.querySelector("h2.chakra-heading");
        return el && el.textContent.trim().length > 0;
      },
      { timeout: 30000 }
    );

    // Extract the text content
    const content = await page.evaluate(() => {
      const el = document.querySelector("h2.chakra-heading");
      return el ? el.textContent.trim() : null;
    });

    console.log("Extracted content:", content);

    // Optional: take screenshot for debugging
    await page.screenshot({ path: "final_screenshot.png", fullPage: true });

    await browser.close();
  } catch (error) {
    console.error("Error:", error);
  }
})();
