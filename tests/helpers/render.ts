import { render } from '@testing-library/react';

export * from '@testing-library/react';

export function renderWithProviders(ui: React.ReactElement) {
  return render(ui);
}
