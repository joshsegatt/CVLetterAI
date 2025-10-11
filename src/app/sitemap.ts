import type { MetadataRoute } from 'next';

const baseUrl = 'https://cvletterai.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/pricing', '/testimonials', '/security', '/dashboard', '/cv-builder', '/letter-builder', '/chat', '/settings'];
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route === '' ? 1 : 0.6
  }));
}
