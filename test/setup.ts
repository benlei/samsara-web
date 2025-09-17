import '@testing-library/jest-dom';
import React from 'react';

// Mock next/router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock next/head
jest.mock('next/head', () => {
  return function Head({ children }: { children: React.ReactNode }) {
    return React.createElement(React.Fragment, null, children);
  };
});

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: jest.fn(),
  }),
}));

// Mock react-ga4
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  event: jest.fn(),
}));

// Mock react-component-export-image
jest.mock('react-component-export-image', () => ({
  exportComponentAsPNG: jest.fn().mockResolvedValue(undefined),
}));

// Mock react-cookie-consent
jest.mock('react-cookie-consent', () => {
  return function CookieConsent({ children }: { children: React.ReactNode }) {
    return React.createElement('div', { 'data-testid': 'cookie-consent' }, children);
  };
});

// Mock window.localStorage
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});