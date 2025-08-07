import puppeteer from "puppeteer";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { url } = await req.json();

  if (!url || !url.startsWith("http")) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      headless: true, // use true in production
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-blink-features=AutomationControlled"
      ]
    });

    const page = await browser.newPage();

    // 🔍 Fake user agent and headers
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36"
    );

    await page.setExtraHTTPHeaders({
      "accept-language": "en-US,en;q=0.9"
    });

    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, "webdriver", { get: () => false });
    });

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    // Wait for dynamic content to load
    await page.waitForFunction(
      () => {
        const el = document.querySelector("h2.chakra-heading");
        return el && el.textContent.trim().length > 0;
      },
      { timeout: 30000 }
    );

    const content = await page.evaluate(() => {
      const el = document.querySelector("h2.chakra-heading");
      return el ? el.textContent.trim() : null;
    });

    await page.screenshot({ path: "final_screenshot.png", fullPage: true });

    await browser.close();

    if (content) {
      return NextResponse.json({ content });
    } else {
      return NextResponse.json({ error: "Element not found" }, { status: 404 });
    }
  } catch (error) {
    console.error("Scraping error:", error);
    return NextResponse.json({ error: error.toString() }, { status: 500 });
  }
}
