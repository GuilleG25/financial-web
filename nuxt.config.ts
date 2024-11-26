// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  app: {
    head: {
      title: 'Dashboard Financiero Personal',
      meta: [
        {
          name: 'description',
          content:
            'Administra tus finanzas personales de manera efectiva con nuestro dashboard financiero.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.png' }],
    },
  },
  modules: ['nuxt-auth-sanctum', '@element-plus/nuxt'],
  sanctum: {
    globalMiddleware: {
      enabled: true,
      allow404WithoutAuth: true,
    },
    mode: 'token',
    redirectIfAuthenticated: true,
    redirectIfUnauthenticated: true,
    endpoints: {
      login: '/auth/login',
      logout: '/auth/logout',
      user: '/auth/user',
    },
    redirect: {
      onLogin: '/',
      onLogout: '/login',
      keepRequestedRoute: true,
    },
  },
  elementPlus: {
    icon: 'ElIcon',
    importStyle: 'scss',
  },
  runtimeConfig: {
    public: {
      endpointApi:
        process.env.NUXT_PUBLIC_SANCTUM_BASE_URL || 'http://localhost:3000',
      logoUrl: '/logo.png',
    },
  },
})
