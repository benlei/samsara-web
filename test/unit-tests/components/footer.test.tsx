import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Footer from '@/components/footer';

// Mock next-themes more thoroughly
const mockSetTheme = jest.fn();
jest.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'light',
    setTheme: mockSetTheme,
  }),
}));

describe('Footer Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders footer structure correctly', () => {
    render(<Footer />);

    // Check Links section
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('GitHub')).toBeInTheDocument();

    // Check About section
    expect(screen.getByText('About')).toBeInTheDocument();
    expect(screen.getByText(/This hobby site currently does not directly store any data/)).toBeInTheDocument();
    expect(screen.getByText(/samsara.pages.dev is not affiliated with or endorsed by HoYoverse/)).toBeInTheDocument();

    // Check external links
    expect(screen.getByText('Genshin Fandom')).toBeInTheDocument();
    expect(screen.getByText('HSR Fandom')).toBeInTheDocument();
  });

  it('displays light mode toggle initially', () => {
    render(<Footer />);

    const toggleLabel = screen.getByText('Light Mode');
    expect(toggleLabel).toBeInTheDocument();
    
    // Semantic UI Radio renders as radio input, not checkbox
    const toggle = screen.getByRole('radio');
    expect(toggle).toBeChecked();
  });

  it('calls setTheme when toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<Footer />);

    // Click on the label since the input is readonly
    const label = screen.getByText('Light Mode');
    
    await user.click(label);

    // Wait for the theme change to be processed
    await waitFor(() => {
      expect(mockSetTheme).toHaveBeenCalledWith('dark');
    });
  });

  it('renders with children', () => {
    const testChild = <div data-testid="test-child">Test Child Content</div>;
    
    render(
      <Footer>
        {testChild}
      </Footer>
    );

    // Footer component doesn't actually render children - it has its own content
    // Check that the footer structure is still rendered
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('renders without children', () => {
    render(<Footer />);

    // Should still render the footer structure
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('has correct grid structure', () => {
    render(<Footer />);

    // Check that the grid columns are present
    const container = screen.getByText('Links').closest('.column');
    expect(container).toBeInTheDocument();

    const aboutContainer = screen.getByText('About').closest('.column');
    expect(aboutContainer).toBeInTheDocument();
  });

  it('includes GitHub icon', () => {
    render(<Footer />);

    // Find the GitHub text and check for the icon
    const githubText = screen.getByText('GitHub');
    const githubLink = githubText.closest('a');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/benlei/samsara-web');
    
    // The icon is rendered as an <i> element with specific classes
    const icon = githubLink?.querySelector('i.github.icon');
    expect(icon).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Footer />);

    const toggle = screen.getByRole('radio');
    expect(toggle).toHaveAttribute('autocomplete', 'off');
  });

  it('renders without children', () => {
    render(<Footer />);

    // Should still render the footer structure
    expect(screen.getByText('Links')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('has correct grid structure', () => {
    render(<Footer />);

    // Check that the grid columns are present
    const container = screen.getByText('Links').closest('.column');
    expect(container).toBeInTheDocument();

    const aboutContainer = screen.getByText('About').closest('.column');
    expect(aboutContainer).toBeInTheDocument();
  });

  it('includes GitHub icon', () => {
    render(<Footer />);

    // The GitHub link is rendered as a listitem instead of a regular link
    const githubLink = screen.getByRole('listitem');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/benlei/samsara-web');
    
    // The icon is rendered as an <i> element with specific classes
    const icon = githubLink.querySelector('i.github.icon');
    expect(icon).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Footer />);

    // Semantic UI Radio renders as radio input, not checkbox
    const toggle = screen.getByRole('radio');
    expect(toggle).toHaveAttribute('autocomplete', 'off');
  });

  it('contains all expected text content', () => {
    render(<Footer />);

    expect(screen.getByText(/Google Analytics, light\/dark mode/)).toBeInTheDocument();
    expect(screen.getByText(/data shown here is sourced from/)).toBeInTheDocument();
    expect(screen.getByText(/There may be bugs/)).toBeInTheDocument();
    expect(screen.getByText(/Note that there are currently no plans for localization/)).toBeInTheDocument();
  });
});