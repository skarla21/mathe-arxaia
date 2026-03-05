// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  srcDir: "app",
  css: [resolve(__dirname, "app/assets/css/main.css")],
  modules: [],
  vite: {
    plugins: [tailwindcss()] as any,
  },
  nitro: {
    experimental: {
      openAPI: false,
    },
  },
  alias: {
    cookie: resolve(__dirname, "node_modules/cookie"),
  },
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabaseAnonKey: "",
    },
    supabaseServiceKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
    authSecret: "",
    googleClientId: "",
    googleClientSecret: "",
  },
});
