import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/components/layout';

// Mock the components that Layout uses
jest.mock('@/components/navbar', () => {
  return function MockNavbar() {
    return <nav data-testid="navbar">Navbar</nav>;
  };
});

jest.mock('@/components/footer', () => {
  return function MockFooter() {
    return <footer data-testid="footer">Footer</footer>;
  };
});

describe('Layout Component', () => {
  it('renders correctly with children', () => {
    const testChild = <div data-testid="test-child">Test Child Content</div>;
    
    render(
      <Layout>
        {testChild}
      </Layout>
    );

    // Check that the main structure is rendered
    expect(screen.getByRole('main')).toBeInTheDocument();
    
    // Check that navbar is rendered
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    
    // Check that footer is rendered
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    
    // Check that children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Child Content')).toBeInTheDocument();
    
    // Check that cookie consent is rendered
    expect(screen.getByTestId('cookie-consent')).toBeInTheDocument();
    expect(screen.getByText('This website uses cookies to enhance the user experience.')).toBeInTheDocument();
  });

  it('sets correct meta tags in head', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    // The title should be set
    const titleElement = document.querySelector('title');
    expect(titleElement?.textContent).toBe('Samsara');

    // Check meta tags
    const descriptionMeta = document.querySelector('meta[name="description"]');
    expect(descriptionMeta?.getAttribute('content')).toContain('Genshin Impact and Honkai: Star Rail');

    const keywordsMeta = document.querySelector('meta[name="keywords"]');
    expect(keywordsMeta?.getAttribute('content')).toContain('Genshin');

    const viewportMeta = document.querySelector('meta[name="viewport"]');
    expect(viewportMeta?.getAttribute('content')).toBe('width=device-width, initial-scale=1');
  });

  it('renders favicon link', () => {
    render(
      <Layout>
        <div>Content</div>
      </Layout>
    );

    const faviconLink = document.querySelector('link[rel="icon"]');
    expect(faviconLink?.getAttribute('href')).toBe('/favicon.ico');
  });

  it('renders with empty children', () => {
    render(<Layout />);

    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('renders with multiple children', () => {
    render(
      <Layout>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
        <span data-testid="child-3">Child 3</span>
      </Layout>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
    expect(screen.getByTestId('child-3')).toBeInTheDocument();
  });
});