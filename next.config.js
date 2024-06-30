const withPWA = require("next-pwa")({
  dest: "public",
  mode: "production",
  disable: process.env.NODE_ENV === "development",
  buildExcludes: [/middleware-manifest\.json$/],
  // Use InjectManifest instead of GenerateSW
  swSrc: "public/service-worker.js", // Path to your custom service worker
});

module.exports = withPWA({});
