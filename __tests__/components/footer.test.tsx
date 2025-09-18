/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, cleanup, fireEvent } from '../test-utils'
import Footer from '../../components/footer'

// Mock next-themes to control theme behavior
const mockSetTheme = vi.fn()
let mockCurrentTheme = 'light'

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: mockCurrentTheme,
    setTheme: mockSetTheme,
  }),
}))

describe('Footer Component - User Behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockCurrentTheme = 'light'
  })

  afterEach(() => {
    cleanup()
  })

  describe('Theme Toggle Behavior', () => {
    it('allows user to switch from light to dark theme', () => {
      render(<Footer />)
      
      // User sees light mode toggle
      const themeSwitch = screen.getByRole('switch')
      expect(themeSwitch).toBeChecked() // Light mode is checked
      expect(screen.getByText('Light Mode')).toBeInTheDocument()
      
      // User clicks to switch to dark mode
      fireEvent.click(themeSwitch)
      
      // System should request theme change
      expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('allows user to switch from dark to light theme', () => {
      // Start with dark theme
      mockCurrentTheme = 'dark'
      
      render(<Footer />)
      
      // User sees dark mode toggle
      const themeSwitch = screen.getByRole('switch')
      expect(themeSwitch).not.toBeChecked() // Dark mode is unchecked
      expect(screen.getByText('Dark Mode')).toBeInTheDocument()
      
      // User clicks to switch to light mode
      fireEvent.click(themeSwitch)
      
      // System should request theme change
      expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('updates toggle state when theme changes externally', () => {
      const { rerender } = render(<Footer />)
      
      // Initially light mode
      expect(screen.getByText('Light Mode')).toBeInTheDocument()
      
      // Theme changes externally (e.g., system preference)
      mockCurrentTheme = 'dark'
      rerender(<Footer />)
      
      // Toggle should reflect the new theme
      expect(screen.getByText('Dark Mode')).toBeInTheDocument()
      const themeSwitch = screen.getByRole('switch')
      expect(themeSwitch).not.toBeChecked()
    })
  })

  describe('External Link Navigation', () => {
    it('provides working GitHub link for users', () => {
      render(<Footer />)
      
      const githubLink = screen.getByRole('link', { name: /github/i })
      expect(githubLink).toHaveAttribute('href', 'https://github.com/benlei/samsara-web')
    })

    it('provides working wiki reference links for users', () => {
      render(<Footer />)
      
      const genshinLink = screen.getByRole('link', { name: /genshin fandom/i })
      const hsrLink = screen.getByRole('link', { name: /hsr fandom/i })
      
      expect(genshinLink).toHaveAttribute('href', 'https://genshin-impact.fandom.com/wiki/Genshin_Impact_Wiki')
      expect(hsrLink).toHaveAttribute('href', 'https://honkai-star-rail.fandom.com/wiki/Honkai:_Star_Rail_Wiki')
      
      // Should open in new tab for external links
      expect(genshinLink).toHaveAttribute('target', '_blank')
      expect(hsrLink).toHaveAttribute('target', '_blank')
    })
  })
})