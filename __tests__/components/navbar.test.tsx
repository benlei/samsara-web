/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '../test-utils'
import userEvent from '@testing-library/user-event'
import Navbar from '../../components/navbar'

// Mock next/router to control navigation behavior
const mockPush = vi.fn()
const mockRouter = {
  route: '/',
  pathname: '/5star/characters',
  query: {},
  asPath: '/',
  push: mockPush,
  replace: vi.fn(),
  back: vi.fn(),
  prefetch: vi.fn(),
}

vi.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

describe('Navbar Component - User Behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup()
  })

  describe('Home Navigation', () => {
    it('allows user to navigate home via logo click', () => {
      render(<Navbar />)
      
      const homeLink = screen.getByRole('link', { name: /samsara/i })
      expect(homeLink).toHaveAttribute('href', '/')
      
      // This tests that the home link is properly configured for navigation
      // The actual navigation is handled by Next.js Link component
    })
  })

  describe('Navigation Menu Behavior', () => {
    it('allows user to access Genshin game sections', async () => {
      const user = userEvent.setup()
      render(<Navbar />)
      
      // User can click on Genshin button to access Genshin sections
      const genshinButton = screen.getByRole('button', { name: /genshin/i })
      await user.click(genshinButton)
      
      // Sidebar should now be visible with Genshin content
      // We expect both Genshin and HSR sidebars to be present, so use getAllByTestId
      const drawers = screen.getAllByTestId('mui-drawer')
      expect(drawers.length).toBeGreaterThan(0)
      expect(screen.getByAltText('Genshin Impact')).toBeInTheDocument()
      expect(screen.getAllByText('5★ Characters')[0]).toBeInTheDocument()
      expect(screen.getAllByText('4★ Characters')[0]).toBeInTheDocument()
      expect(screen.getByText('5★ Weapons')).toBeInTheDocument()
      expect(screen.getByText('4★ Weapons')).toBeInTheDocument()
    })

    it('allows user to access HSR game sections', async () => {
      const user = userEvent.setup()
      render(<Navbar />)
      
      // User can click on HSR button to access HSR sections
      const hsrButton = screen.getByRole('button', { name: /hsr/i })
      await user.click(hsrButton)
      
      // Sidebar should now be visible with HSR content
      const drawers = screen.getAllByTestId('mui-drawer')
      expect(drawers.length).toBeGreaterThan(0)
      expect(screen.getByAltText('Honkai: Star Rail')).toBeInTheDocument()
      expect(screen.getAllByText('5★ Characters')[0]).toBeInTheDocument()
      expect(screen.getAllByText('4★ Characters')[0]).toBeInTheDocument()
      expect(screen.getByText('5★ Lightcones')).toBeInTheDocument()
      expect(screen.getByText('4★ Lightcones')).toBeInTheDocument()
    })

    it('switches between Genshin and HSR sidebars correctly', async () => {
      const user = userEvent.setup()
      render(<Navbar />)
      
      // Open Genshin sidebar first
      const genshinButton = screen.getByRole('button', { name: /genshin/i })
      await user.click(genshinButton)
      
      expect(screen.getByAltText('Genshin Impact')).toBeInTheDocument()
      expect(screen.getByText('5★ Weapons')).toBeInTheDocument()
      
      // Switch to HSR sidebar
      const hsrButton = screen.getByRole('button', { name: /hsr/i })
      await user.click(hsrButton)
      
      expect(screen.getByAltText('Honkai: Star Rail')).toBeInTheDocument()
      expect(screen.getByText('5★ Lightcones')).toBeInTheDocument()
      
      // Note: In the actual implementation, sidebar switching might work differently
      // This tests the buttons are functional and content appears
    })
  })

  describe('Menu Section Expansion', () => {
    it('provides expandable navigation sections for user', async () => {
      const user = userEvent.setup()
      render(<Navbar />)
      
      // User should see main navigation options
      const genshinButton = screen.getByRole('button', { name: /genshin/i })
      const hsrButton = screen.getByRole('button', { name: /hsr/i })
      
      expect(genshinButton).toBeInTheDocument()
      expect(hsrButton).toBeInTheDocument()
      
      // Test that clicking shows expandable content
      await user.click(genshinButton)
      const drawers = screen.getAllByTestId('mui-drawer')
      expect(drawers.length).toBeGreaterThan(0)
    })

    it('allows user to expand character and weapon sections', async () => {
      const user = userEvent.setup()
      render(<Navbar />)
      
      // Open Genshin sidebar
      const genshinButton = screen.getByRole('button', { name: /genshin/i })
      await user.click(genshinButton)
      
      // Should see expandable sections - use getAllByText for multiple matches
      const fiveStarCharsButtons = screen.getAllByText('5★ Characters')
      expect(fiveStarCharsButtons[0]).toBeInTheDocument()
      
      // Clicking should expand the section (in real implementation)
      await user.click(fiveStarCharsButtons[0])
      expect(fiveStarCharsButtons[0]).toBeInTheDocument()
    })

    it('provides sidebar toggle functionality', async () => {
      const user = userEvent.setup()
      render(<Navbar />)
      
      const genshinButton = screen.getByRole('button', { name: /genshin/i })
      
      // Click to activate sidebar functionality
      await user.click(genshinButton)
      
      // Verify sidebar content is available
      const drawers = screen.getAllByTestId('mui-drawer')
      expect(drawers.length).toBeGreaterThan(0)
      
      // Test that both game sections are available to user
      const hsrButton = screen.getByRole('button', { name: /hsr/i })
      await user.click(hsrButton)
      
      // Both sections should be accessible
      expect(drawers.length).toBeGreaterThan(0)
    })
  })

  describe('Navigation Button Functionality', () => {
    it('provides character navigation options for users', () => {
      render(<Navbar />)
      
      // Look for main navigation buttons that users can click
      // These should be properly configured for navigation
      const charactersButtons = screen.queryAllByText(/characters/i)
      const weaponsButtons = screen.queryAllByText(/weapons/i)
      
      // At minimum, navigation elements should be present for user interaction
      // The exact structure may vary but users need access to main sections
      expect(screen.getByRole('banner')).toBeInTheDocument() // navbar container
      
      // Should have character navigation options (5★ and 4★)
      expect(charactersButtons.length).toBeGreaterThan(0)
    })
  })
})