import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://cvletterai.com'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/(dashboard)/', '/(wizard)/', '/(auth)/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
