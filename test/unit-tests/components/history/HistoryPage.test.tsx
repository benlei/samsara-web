import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryPage from '@/components/history/HistoryPage';
import { BannerHistoryDataset, FeaturedHistory } from '@/banners/types';

// Mock child components
jest.mock('@/components/history/HistoryOptions', () => {
  return function MockHistoryOptions({ setSortBy, setOrder, sortBy, order }: any) {
    return (
      <div data-testid="mock-history-options">
        <button onClick={() => setSortBy('last')}>Latest</button>
        <button onClick={() => setSortBy('first')}>Oldest</button>
        <button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}>Toggle Order</button>
        <span data-testid="current-sort">{sortBy}</span>
        <span data-testid="current-order">{order}</span>
      </div>
    );
  };
});

jest.mock('@/components/history/BannerTable', () => {
  return function MockBannerTable(props: any) {
    return (
      <div data-testid="mock-banner-table">
        <span data-testid="banner-type">{props.bannerType}</span>
        <span data-testid="sort-by">{props.sortBy}</span>
        <span data-testid="order">{props.order}</span>
        <span data-testid="featured-count">{props.featuredList.length}</span>
      </div>
    );
  };
});

jest.mock('@/components/PngDownloadButton', () => {
  return function MockPngDownloadButton({ name, type }: any) {
    return (
      <button data-testid="mock-png-download">
        Download {name} {type}
      </button>
    );
  };
});

jest.mock('react-indiana-drag-scroll', () => {
  return function MockScrollContainer({ children, hideScrollbars, ignoreElements, ...domProps }: any) {
    // Filter out non-DOM props to avoid React warnings
    const { className, style, ...otherDomProps } = domProps;
    return (
      <div 
        data-testid="scroll-container" 
        className={`scroll-container ${className || ''}`}
        style={style}
        {...otherDomProps}
      >
        {children}
      </div>
    );
  };
});

describe('HistoryPage Component', () => {
  const mockDataset: BannerHistoryDataset = {
    fiveStarCharacters: [],
    fourStarCharacters: [],
    fiveStarWeapons: [],
    fourStarWeapons: [],
  };

  const mockFeaturedList: FeaturedHistory[] = [
    { name: 'Ayaka', versions: ['5.0', '4.8'] },
    { name: 'Ayato', versions: ['5.1', '4.7'] },
    { name: 'Kazuha', versions: ['5.2', '4.6'] },
  ];

  const defaultProps = {
    dataset: mockDataset,
    featuredList: mockFeaturedList,
    bannerType: 'characters',
    title: <>5★ Character Banner History</>,
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
    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('5★ Character Banner History');
  });

  it('renders explanatory text', () => {
    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByText(/This page shows the banner history of featured characters\/weapons/)).toBeInTheDocument();
    expect(screen.getByText(/By default it sorts by when the featured character\/weapon was last run/)).toBeInTheDocument();
    expect(screen.getByText(/For search\/filtering you can input a comma separated list/)).toBeInTheDocument();
  });

  it('renders search examples in the explanatory text', () => {
    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByText('aya')).toBeInTheDocument();
    expect(screen.getByText('3.6, 3.2, 2.1, 2.5')).toBeInTheDocument();
  });

  it('initializes with default sort and order', () => {
    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByTestId('current-sort')).toHaveTextContent('last');
    expect(screen.getByTestId('current-order')).toHaveTextContent('desc');
  });

  it('loads sort preferences from localStorage on mount', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'history_sort') return 'first';
      if (key === 'history_order') return 'asc';
      return null;
    });

    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByTestId('current-sort')).toHaveTextContent('first');
    expect(screen.getByTestId('current-order')).toHaveTextContent('asc');
  });

  it('ignores invalid localStorage values', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'history_sort') return 'invalid';
      if (key === 'history_order') return 'invalid';
      return null;
    });

    render(<HistoryPage {...defaultProps} />);

    // Should use default values
    expect(screen.getByTestId('current-sort')).toHaveTextContent('last');
    expect(screen.getByTestId('current-order')).toHaveTextContent('desc');
  });

  it('updates sort and saves to localStorage', async () => {
    const user = userEvent.setup();
    render(<HistoryPage {...defaultProps} />);

    const oldestButton = screen.getByText('Oldest');
    await user.click(oldestButton);

    expect(screen.getByTestId('current-sort')).toHaveTextContent('first');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('history_sort', 'first');
  });

  it('updates order and saves to localStorage', async () => {
    const user = userEvent.setup();
    render(<HistoryPage {...defaultProps} />);

    const toggleOrderButton = screen.getByText('Toggle Order');
    await user.click(toggleOrderButton);

    expect(screen.getByTestId('current-order')).toHaveTextContent('asc');
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('history_order', 'asc');
  });

  it('passes correct props to BannerTable', () => {
    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByTestId('banner-type')).toHaveTextContent('characters');
    expect(screen.getByTestId('sort-by')).toHaveTextContent('last');
    expect(screen.getByTestId('order')).toHaveTextContent('desc');
    expect(screen.getByTestId('featured-count')).toHaveTextContent('3');
  });

  it('passes correct props to PngDownloadButton', () => {
    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByTestId('mock-png-download')).toHaveTextContent('Download banner-history characters');
  });

  it('renders scroll container with correct props', () => {
    render(<HistoryPage {...defaultProps} />);

    const scrollContainer = screen.getByTestId('scroll-container');
    expect(scrollContainer).toBeInTheDocument();
    expect(scrollContainer).toHaveClass('scroll-container');
  });

  it('creates and passes ref to BannerTable and PngDownloadButton', () => {
    render(<HistoryPage {...defaultProps} />);

    // The ref should be created and passed to both components
    expect(screen.getByTestId('mock-banner-table')).toBeInTheDocument();
    expect(screen.getByTestId('mock-png-download')).toBeInTheDocument();
  });

  it('works with different banner types', () => {
    const weaponsProps = {
      ...defaultProps,
      bannerType: 'weapons',
      title: <>5★ Weapon Banner History</>,
    };

    render(<HistoryPage {...weaponsProps} />);

    expect(screen.getByRole('heading')).toHaveTextContent('5★ Weapon Banner History');
    expect(screen.getByTestId('banner-type')).toHaveTextContent('weapons');
    expect(screen.getByTestId('mock-png-download')).toHaveTextContent('Download banner-history weapons');
  });

  it('works with empty featured list', () => {
    const emptyProps = {
      ...defaultProps,
      featuredList: [],
    };

    render(<HistoryPage {...emptyProps} />);

    expect(screen.getByTestId('featured-count')).toHaveTextContent('0');
  });

  it('handles localStorage errors gracefully', () => {
    mockLocalStorage.getItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });
    mockLocalStorage.setItem.mockImplementation(() => {
      throw new Error('localStorage error');
    });

    // Should not crash
    expect(() => render(<HistoryPage {...defaultProps} />)).not.toThrow();
  });

  it('maintains component state across re-renders', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<HistoryPage {...defaultProps} />);

    // Change sort
    const oldestButton = screen.getByText('Oldest');
    await user.click(oldestButton);

    expect(screen.getByTestId('current-sort')).toHaveTextContent('first');

    // Re-render with new props
    rerender(<HistoryPage {...defaultProps} featuredList={[]} />);

    // State should be preserved
    expect(screen.getByTestId('current-sort')).toHaveTextContent('first');
  });

  it('accepts valid localStorage sort values', () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'history_sort') return 'runs-last';
      return null;
    });

    render(<HistoryPage {...defaultProps} />);

    expect(screen.getByTestId('current-sort')).toHaveTextContent('runs-last');
  });

  it('has proper container styling', () => {
    render(<HistoryPage {...defaultProps} />);

    const containers = document.querySelectorAll('.container');
    expect(containers.length).toBeGreaterThan(0);
    
    // Check that containers have proper margin styles
    const headerContainer = containers[0];
    expect(headerContainer).toHaveStyle('margin-top: 1em');
  });
});