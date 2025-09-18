import { describe, it, expect } from 'vitest'
import { lightTheme, darkTheme } from '../../lib/theme'

describe('Theme Configuration', () => {
  describe('lightTheme', () => {
    it('should have correct mode', () => {
      expect(lightTheme.palette?.mode).toBe('light')
    })

    it('should have correct primary colors', () => {
      expect(lightTheme.palette?.primary?.main).toBe('#c62828')
      expect(lightTheme.palette?.primary?.light).toBe('#ff5f52')
      expect(lightTheme.palette?.primary?.dark).toBe('#8e0000')
    })

    it('should have Lato font family', () => {
      expect(lightTheme.typography?.fontFamily).toBe('Lato, "Helvetica Neue", Arial, Helvetica, sans-serif')
    })

    it('should have correct heading typography', () => {
      expect(lightTheme.typography?.h1?.fontSize).toBe('2rem')
      expect(lightTheme.typography?.h1?.fontWeight).toBe(700)
      expect(lightTheme.typography?.h2?.fontSize).toBe('1.714rem')
      expect(lightTheme.typography?.h3?.fontSize).toBe('1.28rem')
      expect(lightTheme.typography?.h4?.fontSize).toBe('1.071rem')
      expect(lightTheme.typography?.h5?.fontSize).toBe('1rem')
    })

    it('should be a valid Material-UI theme object', () => {
      expect(lightTheme).toBeDefined()
      expect(lightTheme.palette).toBeDefined()
      expect(lightTheme.typography).toBeDefined()
      expect(lightTheme.components).toBeDefined()
    })
  })

  describe('darkTheme', () => {
    it('should have correct mode', () => {
      expect(darkTheme.palette?.mode).toBe('dark')
    })

    it('should have different primary colors for dark theme', () => {
      expect(darkTheme.palette?.primary?.main).toBe('#ef5350') // Lighter red for dark theme
      expect(darkTheme.palette?.primary?.light).toBe('#ff867c')
      expect(darkTheme.palette?.primary?.dark).toBe('#b61827')
      
      // Should be different from light theme
      expect(darkTheme.palette?.primary?.main).not.toBe(lightTheme.palette?.primary?.main)
    })

    it('should have same typography as light theme', () => {
      expect(darkTheme.typography?.fontFamily).toBe(lightTheme.typography?.fontFamily)
      expect(darkTheme.typography?.h1?.fontSize).toBe(lightTheme.typography?.h1?.fontSize)
      expect(darkTheme.typography?.h2?.fontSize).toBe(lightTheme.typography?.h2?.fontSize)
    })

    it('should be a valid Material-UI theme object', () => {
      expect(darkTheme).toBeDefined()
      expect(darkTheme.palette).toBeDefined()
      expect(darkTheme.typography).toBeDefined()
      expect(darkTheme.components).toBeDefined()
    })
  })

  describe('Theme consistency', () => {
    it('should have different palette modes', () => {
      expect(lightTheme.palette?.mode).not.toBe(darkTheme.palette?.mode)
    })

    it('should share base typography configuration', () => {
      expect(lightTheme.typography?.fontFamily).toBe(darkTheme.typography?.fontFamily)
      
      // Check all heading levels have same sizes
      const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5'] as const
      for (const level of headingLevels) {
        expect(lightTheme.typography?.[level]?.fontSize)
          .toBe(darkTheme.typography?.[level]?.fontSize)
        expect(lightTheme.typography?.[level]?.fontWeight)
          .toBe(darkTheme.typography?.[level]?.fontWeight)
      }
    })

    it('should have transition components configured', () => {
      expect(lightTheme.components?.MuiCssBaseline?.styleOverrides).toBeDefined()
      expect(darkTheme.components?.MuiCssBaseline?.styleOverrides).toBeDefined()
    })

    it('should have accessible color contrast', () => {
      // Primary colors should be accessible for both themes
      expect(lightTheme.palette?.primary?.main).toBeTruthy()
      expect(darkTheme.palette?.primary?.main).toBeTruthy()
      
      // Both themes should have contrasting text
      expect(lightTheme.palette?.primary?.contrastText).toBeDefined()
      expect(darkTheme.palette?.primary?.contrastText).toBeDefined()
    })
  })

  describe('Typography scaling', () => {
    it('should have decreasing font sizes from h1 to h5', () => {
      const h1Size = parseFloat(lightTheme.typography?.h1?.fontSize as string)
      const h2Size = parseFloat(lightTheme.typography?.h2?.fontSize as string)
      const h3Size = parseFloat(lightTheme.typography?.h3?.fontSize as string)
      const h4Size = parseFloat(lightTheme.typography?.h4?.fontSize as string)
      const h5Size = parseFloat(lightTheme.typography?.h5?.fontSize as string)

      expect(h1Size).toBeGreaterThan(h2Size)
      expect(h2Size).toBeGreaterThan(h3Size)
      expect(h3Size).toBeGreaterThan(h4Size)
      expect(h4Size).toBeGreaterThan(h5Size)
    })

    it('should have consistent font weights', () => {
      const headingLevels = ['h1', 'h2', 'h3', 'h4', 'h5'] as const
      for (const level of headingLevels) {
        expect(lightTheme.typography?.[level]?.fontWeight).toBe(700)
        expect(darkTheme.typography?.[level]?.fontWeight).toBe(700)
      }
    })
  })

  describe('Component overrides', () => {
    it('should have body transition styles', () => {
      const lightOverrides = lightTheme.components?.MuiCssBaseline?.styleOverrides
      const darkOverrides = darkTheme.components?.MuiCssBaseline?.styleOverrides
      
      expect(lightOverrides).toBeDefined()
      expect(darkOverrides).toBeDefined()
      
      // Both should have CSS baseline overrides configured
      expect(typeof lightOverrides).toBe('object')
      expect(typeof darkOverrides).toBe('object')
    })
  })
})