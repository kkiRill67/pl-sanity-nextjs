export const defaultSeoConfig = {
  titleTemplate: '%s | My Site',
  defaultTitle: 'My Site',
  description: 'A description of my site for search engines and social platforms.',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com',
    site_name: 'My Site',
  },
  twitter: {
    handle: '@myhandle',
    site: '@myhandle',
    cardType: 'summary_large_image',
  },
  // Yandex verification meta tag – replace the placeholder with your actual verification code
  additionalMetaTags: [
    {
      name: 'yandex-verification',
      content: 'YOUR_YANDEX_VERIFICATION_CODE',
    },
  ],
};
