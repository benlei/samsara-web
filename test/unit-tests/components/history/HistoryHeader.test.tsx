import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryHeader from '@/components/history/HistoryHeader';
import { VersionParts } from '@/banners/types';

// Mock the HistorySearch component
jest.mock('@/components/history/HistorySearch', () => {
  return function MockHistorySearch({ onChange }: { onChange: any }) {
    return (
      <input
        data-testid="mock-history-search"
        placeholder="Filter name..."
        onChange={(e) => onChange(e, { value: e.target.value })}
      />
    );
  };
});

describe('HistoryHeader Component', () => {
  const mockOnChange = jest.fn();
  
  const mockVersionParts: VersionParts[] = [
    { version: '5.0', parts: 2 },
    { version: '4.8', parts: 3 },
    { version: '4.7', parts: 2 },
    { version: '4.6', parts: 2 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table header structure', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    // Check that we have a table header
    const tableHeader = screen.getByRole('rowgroup');
    expect(tableHeader).toBeInTheDocument();
    
    // Check that we have a table row
    const tableRow = screen.getByRole('row');
    expect(tableRow).toBeInTheDocument();
  });

  it('renders search component', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    const searchInput = screen.getByTestId('mock-history-search');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders redo icon in header', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    // Check for redo icon
    const redoIcon = document.querySelector('i.redo.icon');
    expect(redoIcon).toBeInTheDocument();
  });

  it('renders version parts as header cells', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    // Check that each version appears in the header
    expect(screen.getByText('5.0')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('4.7')).toBeInTheDocument();
    expect(screen.getByText('4.6')).toBeInTheDocument();
  });

  it('applies correct colSpan to version headers', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    const version5Header = screen.getByText('5.0').closest('th');
    const version48Header = screen.getByText('4.8').closest('th');
    const version47Header = screen.getByText('4.7').closest('th');

    expect(version5Header).toHaveAttribute('colspan', '2');
    expect(version48Header).toHaveAttribute('colspan', '3');
    expect(version47Header).toHaveAttribute('colspan', '2');
  });

  it('has correct styling for search cell', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    const searchCell = screen.getByTestId('mock-history-search').closest('th');
    expect(searchCell).toHaveClass('borderless');
    expect(searchCell).toHaveStyle('pointer-events: auto');
    expect(searchCell).toHaveStyle('padding: 0 .5em');
  });

  it('forwards onChange to HistorySearch', async () => {
    const user = userEvent.setup();
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    const searchInput = screen.getByTestId('mock-history-search');
    await user.type(searchInput, 'test');

    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({
          value: 'test',
        }),
      }),
      expect.objectContaining({
        value: 'test',
      })
    );
  });

  it('handles empty version parts array', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={[]} />);

    // Should still render search and redo icon
    expect(screen.getByTestId('mock-history-search')).toBeInTheDocument();
    const redoIcon = document.querySelector('i.redo.icon');
    expect(redoIcon).toBeInTheDocument();

    // Should not have any version headers
    const headerCells = screen.getAllByRole('columnheader');
    expect(headerCells).toHaveLength(2); // Only search cell and redo icon cell
  });

  it('handles single version part', () => {
    const singleVersion: VersionParts[] = [{ version: '5.1', parts: 4 }];
    render(<HistoryHeader onChange={mockOnChange} versionParts={singleVersion} />);

    expect(screen.getByText('5.1')).toBeInTheDocument();
    const versionHeader = screen.getByText('5.1').closest('th');
    expect(versionHeader).toHaveAttribute('colspan', '4');
  });

  it('renders multiple version parts with different colspan values', () => {
    const complexVersions: VersionParts[] = [
      { version: '6.0', parts: 1 },
      { version: '5.9', parts: 5 },
      { version: '5.8', parts: 1 },
    ];
    
    render(<HistoryHeader onChange={mockOnChange} versionParts={complexVersions} />);

    const version60Header = screen.getByText('6.0').closest('th');
    const version59Header = screen.getByText('5.9').closest('th');
    const version58Header = screen.getByText('5.8').closest('th');

    expect(version60Header).toHaveAttribute('colspan', '1');
    expect(version59Header).toHaveAttribute('colspan', '5');
    expect(version58Header).toHaveAttribute('colspan', '1');
  });

  it('maintains correct table structure with many versions', () => {
    const manyVersions: VersionParts[] = Array.from({ length: 10 }, (_, i) => ({
      version: `${5 - Math.floor(i / 2)}.${i % 2}`,
      parts: (i % 3) + 1,
    }));

    render(<HistoryHeader onChange={mockOnChange} versionParts={manyVersions} />);

    // Should render all versions
    manyVersions.forEach(vp => {
      expect(screen.getByText(vp.version)).toBeInTheDocument();
    });

    // Should still have the search and redo icon
    expect(screen.getByTestId('mock-history-search')).toBeInTheDocument();
    const redoIcon = document.querySelector('i.redo.icon');
    expect(redoIcon).toBeInTheDocument();
  });

  it('maintains key prop for version parts', () => {
    render(<HistoryHeader onChange={mockOnChange} versionParts={mockVersionParts} />);

    // Check that each version part is properly keyed (no React warnings in console)
    mockVersionParts.forEach(vp => {
      expect(screen.getByText(vp.version)).toBeInTheDocument();
    });
  });

  it('handles version parts with zero parts', () => {
    const versionWithZeroParts: VersionParts[] = [
      { version: '5.0', parts: 0 },
      { version: '4.9', parts: 2 },
    ];

    render(<HistoryHeader onChange={mockOnChange} versionParts={versionWithZeroParts} />);

    const version50Header = screen.getByText('5.0').closest('th');
    const version49Header = screen.getByText('4.9').closest('th');

    expect(version50Header).toHaveAttribute('colspan', '0');
    expect(version49Header).toHaveAttribute('colspan', '2');
  });
});