export interface NavItem {
  label: string;
  href: string;
}

export const marketingNav: NavItem[] = [
  { label: 'Features', href: '#features' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Security', href: '#security' }
];

export const dashboardNav: NavItem[] = [
  { label: 'Overview', href: '/dashboard' },
  { label: 'CV Builder', href: '/cv-builder' },
  { label: 'Letter Builder', href: '/letter-builder' },
  { label: 'AI Chat', href: '/chat' },
  { label: 'Settings', href: '/settings' }
];
