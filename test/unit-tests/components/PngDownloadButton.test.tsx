import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PngDownloadButton from '@/components/PngDownloadButton';
import ReactGA from 'react-ga4';

// Mock react-ga4
jest.mock('react-ga4', () => ({
  event: jest.fn(),
}));

// Mock react-component-export-image
const mockExportComponentAsPNG = jest.fn();
jest.mock('react-component-export-image', () => ({
  exportComponentAsPNG: mockExportComponentAsPNG,
}));

const mockEvent = ReactGA.event as jest.MockedFunction<typeof ReactGA.event>;

describe('PngDownloadButton Component', () => {
  const mockRef = React.createRef<HTMLDivElement>();
  const defaultProps = {
    node: mockRef,
    name: 'test-banner',
    type: 'characters',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockExportComponentAsPNG.mockResolvedValue(undefined);
  });

  it('renders download button', () => {
    render(<PngDownloadButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Download as PNG');
  });

  it('calls export function when clicked', async () => {
    const user = userEvent.setup();
    render(<PngDownloadButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockExportComponentAsPNG).toHaveBeenCalledWith(mockRef, {
        fileName: 'test-banner.png',
        html2CanvasOptions: {
          backgroundColor: 'transparent',
        },
      });
    });
  });

  it('sends Google Analytics event when clicked', async () => {
    const user = userEvent.setup();
    render(<PngDownloadButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockEvent).toHaveBeenCalledWith({
        category: 'test-banner.characters',
        action: 'download_png',
        label: 'Download PNG used for test-banner characters.',
      });
    });
  });

  it('works with different name and type props', async () => {
    const user = userEvent.setup();
    const props = {
      node: mockRef,
      name: 'weapon-history',
      type: 'weapons',
    };

    render(<PngDownloadButton {...props} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockExportComponentAsPNG).toHaveBeenCalledWith(mockRef, {
        fileName: 'weapon-history.png',
        html2CanvasOptions: {
          backgroundColor: 'transparent',
        },
      });

      expect(mockEvent).toHaveBeenCalledWith({
        category: 'weapon-history.weapons',
        action: 'download_png',
        label: 'Download PNG used for weapon-history weapons.',
      });
    });
  });



  it('uses correct file extension', async () => {
    const user = userEvent.setup();
    const props = {
      node: mockRef,
      name: 'my-file-name',
      type: 'test-type',
    };

    render(<PngDownloadButton {...props} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockExportComponentAsPNG).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          fileName: 'my-file-name.png',
        })
      );
    });
  });

  it('passes correct background color to html2canvas', async () => {
    const user = userEvent.setup();
    render(<PngDownloadButton {...defaultProps} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockExportComponentAsPNG).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          html2CanvasOptions: {
            backgroundColor: 'transparent',
          },
        })
      );
    });
  });

  it('works with special characters in name', async () => {
    const user = userEvent.setup();
    const props = {
      node: mockRef,
      name: 'special-chars-@#$%',
      type: 'test',
    };

    render(<PngDownloadButton {...props} />);

    const button = screen.getByRole('button', { name: /download as png/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockExportComponentAsPNG).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          fileName: 'special-chars-@#$%.png',
        })
      );
    });
  });
});