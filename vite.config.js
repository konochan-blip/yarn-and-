import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      includeAssets: ['favicon.png', 'yarn-logo.png', 'icons/*.png'],
      manifest: {
        name: 'YARN&',
        short_name: 'YARN&',
        description: '毛糸・道具・作品をサーバーで管理するアプリ',
        theme_color: '#8C6272',
        background_color: '#F2E8EC',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'ja',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // 新しい SW をすぐに有効化（待機なし）
        skipWaiting: true,
        // 全クライアントを新 SW に即切り替え
        clientsClaim: true,
        // 古いキャッシュを自動削除
        cleanupOutdatedCaches: true,
        // プリキャッシュ対象
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}'],
        // ランタイムキャッシュ
        runtimeCaching: [
          {
            // Google Fonts
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Supabase Storage (画像)
            urlPattern: /^https:\/\/.*\.supabase\.co\/storage\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'supabase-images',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Supabase API (データ) — ネットワーク優先、オフライン時はキャッシュ
            urlPattern: /^https:\/\/.*\.supabase\.co\/rest\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'supabase-api',
              expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 10,
            },
          },
        ],
      },
      devOptions: {
        // 開発時もサービスワーカーを有効化（動作確認用）
        enabled: false,
      },
    }),
  ],
})
