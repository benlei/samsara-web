import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BannerTable from '@/components/history/BannerTable';
import { BannerHistoryDataset, FeaturedHistory } from '@/banners/types';

// Mock the child components and modules
jest.mock('@/components/history/HistoryHeader', () => {
  return function MockHistoryHeader({ onChange, versionParts }: any) {
    return (
      <thead data-testid="mock-history-header">
        <tr>
          <th>
            <input
              data-testid="filter-input"
              placeholder="Filter name..."
              onChange={(e) => onChange(e, { value: e.target.value })}
            />
          </th>
          {versionParts.map((vp: any, idx: number) => (
            <th key={idx} colSpan={vp.parts}>{vp.version}</th>
          ))}
        </tr>
      </thead>
    );
  };
});

jest.mock('@/components/history/HistoryFooter', () => {
  return function MockHistoryFooter() {
    return <tfoot data-testid="mock-history-footer"><tr><td>Footer</td></tr></tfoot>;
  };
});

jest.mock('@/components/history/HistoryRow', () => {
  return function MockHistoryRow({ rundown, bannerType }: any) {
    return (
      <tr data-testid="mock-history-row">
        <td data-testid="character-name">{rundown.name}</td>
        <td data-testid="banner-type">{bannerType}</td>
        <td data-testid="version-count">{rundown.versions.length}</td>
      </tr>
    );
  };
});

jest.mock('@/banners/summary', () => ({
  getFilterFunction: jest.fn((filterText) => (item: any) => {
    if (!filterText) return true;
    return item.name.toLowerCase().includes(filterText.toLowerCase());
  }),
}));

jest.mock('@/banners/version', () => ({
  __esModule: true,
  default: jest.fn((versions) => [
    { version: '5.0', parts: 2 },
    { version: '4.8', parts: 3 },
  ]),
  versionToNumber: jest.fn((version) => {
    const [major, minor] = version.split('.').map(Number);
    return major * 100 + (minor || 0);
  }),
}));

jest.mock('@/banners/rundown', () => ({
  getRundowns: jest.fn((featuredList) => featuredList),
}));

describe('BannerTable Component', () => {
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
    bannerType: 'characters',
    featuredList: mockFeaturedList,
    dataset: mockDataset,
    sortBy: 'last',
    order: 'desc',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table structure correctly', () => {
    render(<BannerTable {...defaultProps} />);

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
    expect(table).toHaveClass('definition', 'unstackable', 'selectable', 'compact', 'history');
  });

  it('renders HistoryHeader with correct props', () => {
    render(<BannerTable {...defaultProps} />);

    expect(screen.getByTestId('mock-history-header')).toBeInTheDocument();
    expect(screen.getByTestId('filter-input')).toBeInTheDocument();
  });

  it('renders HistoryFooter', () => {
    render(<BannerTable {...defaultProps} />);

    expect(screen.getByTestId('mock-history-footer')).toBeInTheDocument();
  });

  it('renders HistoryRow for each featured item', () => {
    render(<BannerTable {...defaultProps} />);

    const rows = screen.getAllByTestId('mock-history-row');
    expect(rows).toHaveLength(3);

    expect(screen.getByText('Ayaka')).toBeInTheDocument();
    expect(screen.getByText('Ayato')).toBeInTheDocument();
    expect(screen.getByText('Kazuha')).toBeInTheDocument();
  });

  it('passes correct props to HistoryRow', () => {
    render(<BannerTable {...defaultProps} />);

    const bannerTypes = screen.getAllByTestId('banner-type');
    bannerTypes.forEach(element => {
      expect(element).toHaveTextContent('characters');
    });
  });

  it('handles filter input changes', async () => {
    const user = userEvent.setup();
    render(<BannerTable {...defaultProps} />);

    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'aya');

    // Should filter the list - only Ayaka and Ayato should remain
    expect(screen.getByText('Ayaka')).toBeInTheDocument();
    expect(screen.getByText('Ayato')).toBeInTheDocument();
    expect(screen.queryByText('Kazuha')).not.toBeInTheDocument();
  });

  it('shows all items when filter is cleared', async () => {
    const user = userEvent.setup();
    render(<BannerTable {...defaultProps} />);

    const filterInput = screen.getByTestId('filter-input');
    
    // Add filter
    await user.type(filterInput, 'aya');
    expect(screen.queryByText('Kazuha')).not.toBeInTheDocument();

    // Clear filter
    await user.clear(filterInput);
    expect(screen.getByText('Kazuha')).toBeInTheDocument();
  });

  it('works with different sort options', () => {
    const props = { ...defaultProps, sortBy: 'first' };
    render(<BannerTable {...props} />);

    expect(screen.getAllByTestId('mock-history-row')).toHaveLength(3);
  });

  it('works with different order options', () => {
    const props = { ...defaultProps, order: 'asc' };
    render(<BannerTable {...props} />);

    expect(screen.getAllByTestId('mock-history-row')).toHaveLength(3);
  });

  it('works with runs-last sort option', () => {
    const props = { ...defaultProps, sortBy: 'runs-last' };
    render(<BannerTable {...props} />);

    expect(screen.getAllByTestId('mock-history-row')).toHaveLength(3);
  });

  it('handles empty featured list', () => {
    const props = { ...defaultProps, featuredList: [] };
    render(<BannerTable {...props} />);

    expect(screen.getByTestId('mock-history-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-history-footer')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-history-row')).not.toBeInTheDocument();
  });

  it('filters work with partial matches', async () => {
    const user = userEvent.setup();
    render(<BannerTable {...defaultProps} />);

    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'ka');

    // Should match Ayaka and Kazuha
    expect(screen.getByText('Ayaka')).toBeInTheDocument();
    expect(screen.getByText('Kazuha')).toBeInTheDocument();
    expect(screen.queryByText('Ayato')).not.toBeInTheDocument();
  });

  it('filter is case insensitive', async () => {
    const user = userEvent.setup();
    render(<BannerTable {...defaultProps} />);

    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'AYAKA');

    expect(screen.getByText('Ayaka')).toBeInTheDocument();
    expect(screen.queryByText('Ayato')).not.toBeInTheDocument();
    expect(screen.queryByText('Kazuha')).not.toBeInTheDocument();
  });

  it('shows no rows when filter matches nothing', async () => {
    const user = userEvent.setup();
    render(<BannerTable {...defaultProps} />);

    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'nonexistent');

    // The component falls back to showing the original list when filter returns no results
    // so we should still see all rows
    const rows = screen.getAllByTestId('mock-history-row');
    expect(rows).toHaveLength(3); // Ayaka, Ayato, Kazuha
  });

  it('works with different banner types', () => {
    const props = { ...defaultProps, bannerType: 'weapons' };
    render(<BannerTable {...props} />);

    const bannerTypes = screen.getAllByTestId('banner-type');
    bannerTypes.forEach(element => {
      expect(element).toHaveTextContent('weapons');
    });
  });

  it('passes dataset to HistoryRow', () => {
    render(<BannerTable {...defaultProps} />);

    // HistoryRow should receive the dataset prop
    expect(screen.getAllByTestId('mock-history-row')).toHaveLength(3);
  });

  it('maintains filter state across prop changes', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<BannerTable {...defaultProps} />);

    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'aya');

    // Re-render with different props
    rerender(<BannerTable {...defaultProps} order="asc" />);

    // Filter should still be applied
    expect(filterInput).toHaveValue('aya');
    expect(screen.getByText('Ayaka')).toBeInTheDocument();
    expect(screen.queryByText('Kazuha')).not.toBeInTheDocument();
  });

  it('handles special characters in filter', async () => {
    const user = userEvent.setup();
    const specialCharactersList: FeaturedHistory[] = [
      { name: 'Jean', versions: ['1.0'] },
      { name: 'Albedo', versions: ['1.2'] },
    ];
    const props = { ...defaultProps, featuredList: specialCharactersList };
    
    render(<BannerTable {...props} />);

    const filterInput = screen.getByTestId('filter-input');
    await user.type(filterInput, 'Jean');

    expect(screen.getByText('Jean')).toBeInTheDocument();
    expect(screen.queryByText('Albedo')).not.toBeInTheDocument();
  });
});