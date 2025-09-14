import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistoryOptions from '@/components/history/HistoryOptions';

describe('HistoryOptions Component', () => {
  const defaultProps = {
    sortBy: 'last',
    order: 'desc',
    setSortBy: jest.fn(),
    setOrder: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all sort buttons', () => {
    render(<HistoryOptions {...defaultProps} />);

    expect(screen.getByText('Latest')).toBeInTheDocument();
    expect(screen.getByText('Oldest')).toBeInTheDocument();
    expect(screen.getByText('Total Runs')).toBeInTheDocument();
  });

  it('shows active state for current sort option', () => {
    render(<HistoryOptions {...defaultProps} />);

    const latestButton = screen.getByText('Latest').closest('button');
    expect(latestButton).toHaveClass('active');

    const oldestButton = screen.getByText('Oldest').closest('button');
    expect(oldestButton).not.toHaveClass('active');

    const totalRunsButton = screen.getByText('Total Runs').closest('button');
    expect(totalRunsButton).not.toHaveClass('active');
  });

  it('shows active state for different sort option', () => {
    const props = { ...defaultProps, sortBy: 'first' };
    render(<HistoryOptions {...props} />);

    const latestButton = screen.getByText('Latest').closest('button');
    expect(latestButton).not.toHaveClass('active');

    const oldestButton = screen.getByText('Oldest').closest('button');
    expect(oldestButton).toHaveClass('active');
  });

  it('shows sort icon only for active button', () => {
    render(<HistoryOptions {...defaultProps} />);

    // Latest should have visible sort icon
    const latestButton = screen.getByText('Latest').closest('button');
    const latestIcon = latestButton?.querySelector('i.sort.icon');
    expect(latestIcon).toBeInTheDocument();
    expect(latestIcon).not.toHaveClass('hidden');

    // Oldest should have hidden sort icon
    const oldestButton = screen.getByText('Oldest').closest('button');
    const oldestIcon = oldestButton?.querySelector('i.sort.icon');
    expect(oldestIcon).toBeInTheDocument();
    expect(oldestIcon).toHaveClass('hidden');

    // Total Runs should have hidden sort icon
    const totalRunsButton = screen.getByText('Total Runs').closest('button');
    const totalRunsIcon = totalRunsButton?.querySelector('i.sort.icon');
    expect(totalRunsIcon).toBeInTheDocument();
    expect(totalRunsIcon).toHaveClass('hidden');
  });

  it('calls setSortBy when clicking different sort option', async () => {
    const user = userEvent.setup();
    render(<HistoryOptions {...defaultProps} />);

    const oldestButton = screen.getByText('Oldest');
    await user.click(oldestButton);

    expect(defaultProps.setSortBy).toHaveBeenCalledWith('first');
    expect(defaultProps.setOrder).not.toHaveBeenCalled();
  });

  it('toggles order when clicking same sort option', async () => {
    const user = userEvent.setup();
    render(<HistoryOptions {...defaultProps} />);

    const latestButton = screen.getByText('Latest');
    await user.click(latestButton);

    expect(defaultProps.setSortBy).not.toHaveBeenCalled();
    expect(defaultProps.setOrder).toHaveBeenCalledWith('asc');
  });

  it('toggles from asc to desc', async () => {
    const user = userEvent.setup();
    const props = { ...defaultProps, order: 'asc' };
    render(<HistoryOptions {...props} />);

    const latestButton = screen.getByText('Latest');
    await user.click(latestButton);

    expect(defaultProps.setOrder).toHaveBeenCalledWith('desc');
  });

  it('handles Total Runs sort option correctly', async () => {
    const user = userEvent.setup();
    render(<HistoryOptions {...defaultProps} />);

    const totalRunsButton = screen.getByText('Total Runs');
    await user.click(totalRunsButton);

    expect(defaultProps.setSortBy).toHaveBeenCalledWith('runs-last');
  });

  it('shows correct active state for runs-last sort', () => {
    const props = { ...defaultProps, sortBy: 'runs-last' };
    render(<HistoryOptions {...props} />);

    const totalRunsButton = screen.getByText('Total Runs').closest('button');
    expect(totalRunsButton).toHaveClass('active');

    const totalRunsIcon = totalRunsButton?.querySelector('i.sort.icon');
    expect(totalRunsIcon).not.toHaveClass('hidden');
  });

  it('handles multiple rapid clicks correctly', async () => {
    const user = userEvent.setup();
    const setSortBy = jest.fn();
    
    // Start with 'last' (Latest)
    const { rerender } = render(<HistoryOptions {...defaultProps} setSortBy={setSortBy} />);

    const latestButton = screen.getByText('Latest');
    const oldestButton = screen.getByText('Oldest');
    const totalRunsButton = screen.getByText('Total Runs');

    // Click 1: Oldest (changes from 'last' to 'first')
    await user.click(oldestButton);
    expect(setSortBy).toHaveBeenNthCalledWith(1, 'first');

    // Simulate prop update
    rerender(<HistoryOptions {...defaultProps} sortBy="first" setSortBy={setSortBy} />);

    // Click 2: Total Runs (changes from 'first' to 'runs-last')
    await user.click(totalRunsButton);
    expect(setSortBy).toHaveBeenNthCalledWith(2, 'runs-last');

    // Simulate prop update
    rerender(<HistoryOptions {...defaultProps} sortBy="runs-last" setSortBy={setSortBy} />);

    // Click 3: Latest (changes from 'runs-last' to 'last')
    await user.click(latestButton);
    expect(setSortBy).toHaveBeenNthCalledWith(3, 'last');

    expect(setSortBy).toHaveBeenCalledTimes(3);
  });

  it('maintains button group structure', () => {
    render(<HistoryOptions {...defaultProps} />);

    const buttonGroup = screen.getByText('Latest').closest('.buttons');
    expect(buttonGroup).toBeInTheDocument();
    
    // Should have 3 buttons in the group
    const buttons = buttonGroup?.querySelectorAll('button');
    expect(buttons).toHaveLength(3);
  });

  it('has proper widths attribute', () => {
    render(<HistoryOptions {...defaultProps} />);

    const buttonGroup = screen.getByText('Latest').closest('.buttons');
    expect(buttonGroup).toHaveClass('three'); // Semantic UI class for widths={3}
  });

  it('preserves other props when setting new sort', async () => {
    const user = userEvent.setup();
    const customProps = {
      ...defaultProps,
      order: 'asc',
      sortBy: 'first',
    };
    render(<HistoryOptions {...customProps} />);

    const totalRunsButton = screen.getByText('Total Runs');
    await user.click(totalRunsButton);

    // Should call setSortBy but not affect other props
    expect(customProps.setSortBy).toHaveBeenCalledWith('runs-last');
    expect(customProps.setOrder).not.toHaveBeenCalled();
  });
});