export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/digital-log', '/log-history', '/api/'],
    },
    sitemap: 'https://thevineluxuries.com/sitemap.xml',
  }
}
