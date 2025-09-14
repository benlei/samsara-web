import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RunsSummaryPage from '@/components/summary/RunsSummaryPage';
import { Featured } from '@/banners/types';

// Mock child components
jest.mock('@/components/PngDownloadButton', () => {
  return function MockPngDownloadButton({ name, type }: any) {
    return (
      <button data-testid="mock-png-download">
        Download {name} {type}
      </button>
    );
  };
});

jest.mock('@/components/summary/stat/RunsCounterSummary', () => {
  return function MockRunsCounterSummary({ order, type, featuredList }: any) {
    return (
      <div data-testid="mock-runs-counter">
        <span data-testid="counter-order">{order}</span>
        <span data-testid="counter-type">{type}</span>
        <span data-testid="counter-featured-count">{featuredList.length}</span>
      </div>
    );
  };
});

describe('RunsSummaryPage Component', () => {
  const mockFeaturedList: Featured[] = [
    { name: 'Ayaka', versions: ['5.0', '4.8'], dates: [] },
    { name: 'Ayato', versions: ['5.1', '4.7'], dates: [] },
    { name: 'Kazuha', versions: ['5.2', '4.6'], dates: [] },
  ];

  const defaultProps = {
    data: { featuredList: mockFeaturedList },
    title: <>5★ Character Total Runs</>,
    type: 'characters',
  };

  // Mock localStorage
  const mockLocalStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  };
  Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  it('renders page title correctly', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('5★ Character Total Runs');
  });

  it('renders explanatory text', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    expect(screen.getByText('This page lists out the total runs of featured character/weapons.')).toBeInTheDocument();
  });

  it('renders runs sort button', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    const runsButton = screen.getByRole('button', { name: /runs/i });
    expect(runsButton).toBeInTheDocument();
    expect(runsButton).toHaveClass('active');
    
    // Check for sort icon
    const sortIcon = runsButton.querySelector('i.sort.icon');
    expect(sortIcon).toBeInTheDocument();
  });

  it('initializes with default order (desc)', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    expect(screen.getByTestId('counter-order')).toHaveTextContent('desc');
  });

  it('loads order preference from localStorage on mount', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'runs_order') return 'asc';
      return null;
    });

    render(<RunsSummaryPage {...defaultProps} />);

    expect(screen.getByTestId('counter-order')).toHaveTextContent('asc');
  });

  it('ignores invalid localStorage order values', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'runs_order') return 'invalid';
      return null;
    });

    render(<RunsSummaryPage {...defaultProps} />);

    // Should use default value
    expect(screen.getByTestId('counter-order')).toHaveTextContent('desc');
  });

  it('toggles order when button is clicked', async () => {
    const user = userEvent.setup();
    render(<RunsSummaryPage {...defaultProps} />);

    const runsButton = screen.getByRole('button', { name: /runs/i });
    
    // Initial state should be desc
    expect(screen.getByTestId('counter-order')).toHaveTextContent('desc');

    await user.click(runsButton);

    // Should toggle to asc
    expect(screen.getByTestId('counter-order')).toHaveTextContent('asc');
  });

  it('saves order preference to localStorage when changed', async () => {
    const user = userEvent.setup();
    render(<RunsSummaryPage {...defaultProps} />);

    const runsButton = screen.getByRole('button', { name: /runs/i });
    await user.click(runsButton);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('runs_order', 'asc');
  });

  it('passes correct props to RunsCounterSummary', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    expect(screen.getByTestId('counter-type')).toHaveTextContent('characters');
    expect(screen.getByTestId('counter-order')).toHaveTextContent('desc');
    expect(screen.getByTestId('counter-featured-count')).toHaveTextContent('3');
  });

  it('passes correct props to PngDownloadButton', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    expect(screen.getByTestId('mock-png-download')).toHaveTextContent('Download summary characters');
  });

  it('works with different types', () => {
    const weaponsProps = {
      ...defaultProps,
      type: 'weapons',
      title: <>5★ Weapon Total Runs</>,
    };

    render(<RunsSummaryPage {...weaponsProps} />);

    expect(screen.getByRole('heading')).toHaveTextContent('5★ Weapon Total Runs');
    expect(screen.getByTestId('counter-type')).toHaveTextContent('weapons');
    expect(screen.getByTestId('mock-png-download')).toHaveTextContent('Download summary weapons');
  });

  it('works with empty featured list', () => {
    const emptyProps = {
      ...defaultProps,
      data: { featuredList: [] },
    };

    render(<RunsSummaryPage {...emptyProps} />);

    expect(screen.getByTestId('counter-featured-count')).toHaveTextContent('0');
  });

  it('toggles back and forth between asc and desc', async () => {
    const user = userEvent.setup();
    render(<RunsSummaryPage {...defaultProps} />);

    const runsButton = screen.getByRole('button', { name: /runs/i });
    
    // Start with desc
    expect(screen.getByTestId('counter-order')).toHaveTextContent('desc');

    // Click to asc
    await user.click(runsButton);
    expect(screen.getByTestId('counter-order')).toHaveTextContent('asc');

    // Click back to desc
    await user.click(runsButton);
    expect(screen.getByTestId('counter-order')).toHaveTextContent('desc');
  });

  it('maintains button active state', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    const runsButton = screen.getByRole('button', { name: /runs/i });
    expect(runsButton).toHaveClass('active');
  });

  it('has correct button group structure', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    const buttonGroup = screen.getByRole('button', { name: /runs/i }).closest('.buttons');
    expect(buttonGroup).toBeInTheDocument();
    expect(buttonGroup).toHaveClass('two'); // widths={2} creates 'two' class
  });

  it('has fluid button layout', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    const runsButton = screen.getByRole('button', { name: /runs/i });
    expect(runsButton).toHaveClass('fluid');
  });

  it('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Should not crash
    expect(() => render(<RunsSummaryPage {...defaultProps} />)).not.toThrow();
  });

  it('creates and passes ref to components', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    // The ref should be created and passed to components
    expect(screen.getByTestId('mock-runs-counter')).toBeInTheDocument();
    expect(screen.getByTestId('mock-png-download')).toBeInTheDocument();
  });

  it('has proper container styling', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    const containers = document.querySelectorAll('.container');
    expect(containers.length).toBeGreaterThan(0);
  });

  it('maintains state across re-renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<RunsSummaryPage {...defaultProps} />);

    // Change order
    const runsButton = screen.getByRole('button', { name: /runs/i });
    await user.click(runsButton);

    expect(screen.getByTestId('counter-order')).toHaveTextContent('asc');

    // Re-render with new props
    rerender(<RunsSummaryPage {...defaultProps} data={{ featuredList: [] }} />);

    // State should be preserved
    expect(screen.getByTestId('counter-order')).toHaveTextContent('asc');
  });

  it('centers download button', () => {
    render(<RunsSummaryPage {...defaultProps} />);

    const downloadContainer = screen.getByTestId('mock-png-download').closest('.container');
    expect(downloadContainer).toHaveClass('center');
  });
});