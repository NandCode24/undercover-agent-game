export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://undercover-agent-game.vercel.app/sitemap.xml",
  };
}
