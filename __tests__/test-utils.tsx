import React from 'react';
import { render, RenderOptions } from '@testing-library/react';

// Lightweight mock theme provider for faster testing
const MockThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <div data-testid="mock-theme-provider">{children}</div>;
};

const MockCssBaseline = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

interface TestWrapperProps {
  children: React.ReactNode;
}

const TestWrapper: React.FC<TestWrapperProps> = ({ children }) => (
  <MockThemeProvider>
    <MockCssBaseline />
    {children}
  </MockThemeProvider>
);

const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { wrapper: TestWrapper, ...options });

export * from '@testing-library/react';
export { customRender as render };
export { MockThemeProvider as testTheme };