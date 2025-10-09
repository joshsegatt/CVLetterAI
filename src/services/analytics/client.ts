interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
}

export function track(event: AnalyticsEvent) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[analytics]', event);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('analytics', { detail: event }));
  }
}

export function pageview(url: string) {
  track({ name: 'pageview', properties: { url } });
}
