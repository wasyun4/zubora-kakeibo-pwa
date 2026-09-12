import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  base: "/zubora-kakeibo-pwa/",

  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      manifest: {
        lang: "ja",
        name: "ズボラ家計簿",
        short_name: "家計簿",
        description:
          "収入・支出・予算を手軽に記録できる家計簿アプリ",
        theme_color: "#2e7d32",
        background_color: "#f5f8f6",
        display: "standalone",
        start_url: "/zubora-kakeibo-pwa/",
        scope: "/zubora-kakeibo-pwa/",
        icons: [
          {
            src: "/zubora-kakeibo-pwa/app-icon.svg",
            sizes: "any",
            type: "image/svg+xml",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
