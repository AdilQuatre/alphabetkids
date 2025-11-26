module.exports = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{html,js,css,png,jpg,gif,svg,eot,ttf,woff,woff2}'
  ],
  swDest: 'dist/sw.js',
  clientsClaim: true,
  skipWaiting: true,
  runtimeCaching: [{
    urlPattern: /^https:\/\/cdn\.jsdelivr\.net/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'emoji-cache',
      expiration: {
        maxEntries: 100,
        maxAgeSeconds: 30 * 24 * 60 * 60 // 30 jours
      }
    }
  }, {
    urlPattern: /^https:\/\/assets\.mixkit\.co/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'audio-cache',
      expiration: {
        maxEntries: 10,
        maxAgeSeconds: 7 * 24 * 60 * 60 // 7 jours
      }
    }
  }]
};