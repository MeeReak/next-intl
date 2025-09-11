/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://next-js-intl.vercel.app",
  generateRobotsTxt: true,
  i18n: {
    locales: ["km", "en"],
    defaultLocale: "km"
  },
  additionalPaths: async (config) => [
    { loc: "/en/", lastmod: new Date().toISOString() },
    { loc: "/km/", lastmod: new Date().toISOString() },
    { loc: "/en/case-convert", lastmod: new Date().toISOString() },
    { loc: "/km/case-convert", lastmod: new Date().toISOString() },
    { loc: "/en/google-len", lastmod: new Date().toISOString() },
    { loc: "/km/google-len", lastmod: new Date().toISOString() },
    { loc: "/en/fake-filter", lastmod: new Date().toISOString() },
    { loc: "/km/fake-filter", lastmod: new Date().toISOString() },
    { loc: "/en/lunar-date", lastmod: new Date().toISOString() },
    { loc: "/km/lunar-date", lastmod: new Date().toISOString() },
    { loc: "/en/json-data", lastmod: new Date().toISOString() },
    { loc: "/km/json-data", lastmod: new Date().toISOString() }
    // Add other paths manually or fetch from your CMS/db
  ]
  // transform: async (config, path) => {
  //   // Skip placeholder routes like dynamic `[locale]` or `[...rest]`
  //   if (
  //     path.includes("[") ||
  //     path.includes("_not-found") ||
  //     path === "/_middleware"
  //   ) {
  //     return null;
  //   }

  //   // Generate per-locale URLs
  //   return config.i18n.locales.map((locale) => ({
  //     loc: `/${locale}${path === "/" ? "" : path}`,
  //     changefreq: "daily",
  //     priority: 0.7,
  //     lastmod: new Date().toISOString(),
  //   }));
  // },
};
