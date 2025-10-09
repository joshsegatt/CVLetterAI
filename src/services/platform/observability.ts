export function captureError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV !== 'production') {
    console.error('[observability] error', error, context);
  }
}

export function logMetric(name: string, value: number, tags?: Record<string, string>) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[observability] metric', { name, value, tags });
  }
}
