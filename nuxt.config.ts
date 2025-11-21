import tailwindcss from "@tailwindcss/vite"
import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },


  app: {
    head: {
      title: "maikendangelo.fr",
      htmlAttrs: {
        lang: "fr",
      },
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }],
    },
  },

  // Plugins Vite
  vite: {
    plugins: [tailwindcss()],
  },

  modules: [
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/image",
    "@nuxt/ui",
    "@primevue/nuxt-module",
  ],

  primevue: {
    options: {
      theme: {
        preset: {
          semantic: {
            primary: {
              color: "#FCF5ED",
              contrastColor: "#1F1717",
              hoverColor: "#DAD2DB",
              activeColor: "#CE5A67",
            },
          },
          ...Aura,
        },
      },
    },
  },

  css: ["~/assets/css/main.css"],
});
