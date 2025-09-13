import createNextIntlPlugin from "next-intl/plugin";
import withPWA from "next-pwa";

/** Base Next.js config */
const baseConfig = {
  reactStrictMode: true
};

/** Configure PWA */
const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Cache Google Fonts
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "google-fonts",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      // Cache CDN assets
      urlPattern: /^https:\/\/cdn\.jsdelivr\.net\/.*/i,
      handler: "CacheFirst",
      options: {
        cacheName: "cdn-cache",
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
        }
      }
    },
    {
      // Cache pages (HTML documents)
      urlPattern: ({ request }) => request.destination === "document",
      handler: "NetworkFirst",
      options: {
        cacheName: "pages-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    },
    {
      // Cache static assets (images, CSS, JS)
      urlPattern: ({ request }) =>
        ["script", "style", "image"].includes(request.destination),
      handler: "StaleWhileRevalidate",
      options: {
        cacheName: "static-resources",
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
        }
      }
    }
  ]
});

/** Configure next-intl */
const withNextIntl = createNextIntlPlugin();

/** Export final config (PWA + i18n combined) */
export default withNextIntl(withPWAConfig(baseConfig));
