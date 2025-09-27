import tailwindcss from "@tailwindcss/vite"
import Aura from '@primeuix/themes/aura'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  ssr: false,
  hooks: {
    'prerender:routes' ({routes}) {
      routes.clear();
    }
  },

  css: ["~/assets/css/main.css"],

  // Plugins Vite
  vite: {
    plugins: [
      tailwindcss(),
    ]
  },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui',
    '@primevue/nuxt-module',
  ],

  primevue: {
    options: {
      theme: {
        preset: Aura,
      }
    }
  }
})