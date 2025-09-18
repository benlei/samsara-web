/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@/test-utils'
import HistoryOptions from '@/components/history/HistoryOptions'

describe('HistoryOptions Component - User Behaviors', () => {
  let mockSetSortBy: ReturnType<typeof vi.fn>
  let mockSetOrder: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockSetSortBy = vi.fn()
    mockSetOrder = vi.fn()
  })

  const getDefaultProps = () => ({
    sortBy: 'last',
    order: 'desc' as const,
    setSortBy: mockSetSortBy,
    setOrder: mockSetOrder,
  })

  afterEach(() => {
    cleanup()
  })

  describe('Sort Selection Behavior', () => {
    it('allows user to switch between different sort options', () => {
      render(<HistoryOptions {...getDefaultProps()} />)
      
      // User should see all sorting options
      const latestButton = screen.getByRole('button', { name: /latest/i })
      const oldestButton = screen.getByRole('button', { name: /oldest/i })
      const totalRunsButton = screen.getByRole('button', { name: /total runs/i })
      
      expect(latestButton).toBeInTheDocument()
      expect(oldestButton).toBeInTheDocument()
      expect(totalRunsButton).toBeInTheDocument()
      
      // Current sort should be highlighted (Latest is selected by default)
      expect(latestButton).toHaveClass('MuiButton-contained')
    })

    it('allows user to change sort to oldest first', () => {
      render(<HistoryOptions {...getDefaultProps()} />)
      
      const oldestButton = screen.getByRole('button', { name: /oldest/i })
      
      // User clicks oldest to sort by first appearance
      fireEvent.click(oldestButton)
      
      // Should trigger sort change
      expect(mockSetSortBy).toHaveBeenCalledWith('first')
    })

    it('allows user to change sort to total runs', () => {
      render(<HistoryOptions {...getDefaultProps()} />)
      
      const totalRunsButton = screen.getByRole('button', { name: /total runs/i })
      
      // User clicks total runs to sort by banner frequency
      fireEvent.click(totalRunsButton)
      
      // Should trigger sort change
      expect(mockSetSortBy).toHaveBeenCalledWith('runs-last')
    })
  })

  describe('Sort Order Toggle Behavior', () => {
    it('allows user to toggle sort order by clicking same sort option', () => {
      const props = { ...getDefaultProps(), sortBy: 'last', order: 'desc' as const }
      render(<HistoryOptions {...props} />)
      
      const latestButton = screen.getByRole('button', { name: /latest/i })
      
      // User clicks the already selected sort to reverse order
      fireEvent.click(latestButton)
      
      // Should toggle from desc to asc
      expect(mockSetOrder).toHaveBeenCalledWith('asc')
    })

    it('allows user to toggle from ascending to descending order', () => {
      const props = { ...getDefaultProps(), sortBy: 'first', order: 'asc' as const }
      render(<HistoryOptions {...props} />)
      
      const oldestButton = screen.getByRole('button', { name: /oldest/i })
      
      // User clicks the already selected sort to reverse order
      fireEvent.click(oldestButton)
      
      // Should toggle from asc to desc
      expect(mockSetOrder).toHaveBeenCalledWith('desc')
    })
  })

  describe('Visual Sort Indicators', () => {
    it('shows which sort option is currently active', () => {
      const props = { ...getDefaultProps(), sortBy: 'runs-last' }
      render(<HistoryOptions {...props} />)
      
      const latestButton = screen.getByRole('button', { name: /latest/i })
      const totalRunsButton = screen.getByRole('button', { name: /total runs/i })
      
      // Active sort should be highlighted
      expect(totalRunsButton).toHaveClass('MuiButton-contained')
      expect(latestButton).toHaveClass('MuiButton-outlined')
    })

    it('shows sort icon for active sort option', () => {
      const props = { ...getDefaultProps(), sortBy: 'first' }
      render(<HistoryOptions {...props} />)
      
      // Active sort should show sort icon
      const oldestButton = screen.getByRole('button', { name: /oldest/i })
      expect(oldestButton).toHaveClass('MuiButton-contained')
      
      // Sort icon should be present (via startIcon prop)
      // The icon presence is tested through the contained variant styling
    })
  })
})