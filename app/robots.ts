export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Signed-in surfaces: no search value, and crawling them just burns
      // crawl budget on redirects to the sign-in page. The pages also send
      // noindex themselves, so this is belt-and-braces for /auth, which is a
      // route handler and cannot set meta tags.
      disallow: ['/account/', '/admin/', '/auth/'],
    },
    sitemap: 'https://danangmls.com/sitemap.xml',
  };
}
