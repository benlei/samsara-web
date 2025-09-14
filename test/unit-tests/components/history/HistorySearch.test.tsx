import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HistorySearch from '@/components/history/HistorySearch';

// Mock lodash debounce
jest.mock('lodash', () => ({
  debounce: (fn: any, delay: number) => {
    // For testing, we'll create a simple debounce mock
    let timeoutId: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  },
}));

describe('HistorySearch Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders search input correctly', () => {
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('autocomplete', 'off');
  });

  it('renders search icon', () => {
    render(<HistorySearch onChange={mockOnChange} />);

    const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('i.search.icon');
    expect(searchIcon).toBeInTheDocument();
  });

  it('has correct styling classes', () => {
    render(<HistorySearch onChange={mockOnChange} />);

    const inputContainer = screen.getByRole('textbox').closest('.input');
    expect(inputContainer).toHaveClass('fluid');
    expect(inputContainer).toHaveClass('desktop');
    expect(inputContainer).toHaveAttribute('data-html2canvas-ignore');
  });

  it('applies debounced onChange when user types', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    await user.type(input, 'ayaka');
    
    // Should not call immediately
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Advance timers by debounce delay (250ms)
    jest.advanceTimersByTime(250);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalled();
    });
  });

  it('debounces multiple rapid changes', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    // Type multiple characters rapidly
    await user.type(input, 'a');
    await user.type(input, 'y');
    await user.type(input, 'a');
    
    // Should not call yet
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Advance timers
    jest.advanceTimersByTime(250);
    
    await waitFor(() => {
      // Should only be called once despite multiple keystrokes
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  it('resets debounce timer on new input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    await user.type(input, 'aya');
    
    // Advance time but not enough to trigger
    jest.advanceTimersByTime(200);
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Type more - this should reset the timer
    await user.type(input, 'ka');
    
    // Advance the original timer amount - should not trigger yet
    jest.advanceTimersByTime(50);
    expect(mockOnChange).not.toHaveBeenCalled();
    
    // Advance the full amount from the last input
    jest.advanceTimersByTime(250);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });
  });

  it('calls onChange with correct event and data parameters', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    await user.type(input, 'test');
    jest.advanceTimersByTime(250);
    
    await waitFor(() => {
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
  });

  it('handles empty input', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    await user.type(input, 'test');
    await user.clear(input);
    
    jest.advanceTimersByTime(250);
    
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith(
        expect.objectContaining({
          target: expect.objectContaining({
            value: '',
          }),
        }),
        expect.objectContaining({
          value: '',
        })
      );
    });
  });

  it('has correct input styling', () => {
    render(<HistorySearch onChange={mockOnChange} />);

    const inputWrapper = screen.getByRole('textbox').closest('.input');
    expect(inputWrapper).toHaveStyle('min-width: 16em');
  });

  it('renders as fluid input', () => {
    render(<HistorySearch onChange={mockOnChange} />);

    const inputWrapper = screen.getByRole('textbox').closest('.input');
    expect(inputWrapper).toHaveClass('fluid');
  });

  it('has icon positioned correctly', () => {
    render(<HistorySearch onChange={mockOnChange} />);

    const inputWrapper = screen.getByRole('textbox').closest('.input');
    expect(inputWrapper).toHaveClass('icon');
  });

  it('allows focus and blur events', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    // Focus the input
    await user.click(input);
    expect(input).toHaveFocus();
    
    // Blur by pressing Tab key
    await user.keyboard('{Tab}');
    expect(input).not.toHaveFocus();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<HistorySearch onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Filter name...');
    
    await user.click(input);
    await user.keyboard('hello world');
    
    jest.advanceTimersByTime(250);
    
    await waitFor(() => {
      expect(input).toHaveValue('hello world');
      expect(mockOnChange).toHaveBeenCalled();
    });
  });
});