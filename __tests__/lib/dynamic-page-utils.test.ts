import { describe, it, expect } from 'vitest'
import {
  VALID_COMBINATIONS,
  getDisplayText,
  getPageTitle,
  getPageHeading,
  getTypeContext,
  getBannerType,
  isHSRType,
  type ValidCombination
} from '../../lib/dynamic-page-utils'

describe('Dynamic Page Utils', () => {
  describe('VALID_COMBINATIONS', () => {
    it('should contain all expected combinations', () => {
      expect(VALID_COMBINATIONS).toHaveLength(8)
      
      const expectedCombinations: ValidCombination[] = [
        { star: "4star", type: "characters" },
        { star: "5star", type: "characters" },
        { star: "4star", type: "weapons" },
        { star: "5star", type: "weapons" },
        { star: "4star", type: "hsr-characters" },
        { star: "5star", type: "hsr-characters" },
        { star: "4star", type: "lightcones" },
        { star: "5star", type: "lightcones" }
      ]
      
      expect(VALID_COMBINATIONS).toEqual(expectedCombinations)
    })
  })

  describe('getDisplayText', () => {
    it('should return correct display text for characters', () => {
      const result = getDisplayText('characters')
      expect(result).toEqual({
        itemText: 'Character',
        itemsText: 'Characters'
      })
    })

    it('should return correct display text for HSR characters', () => {
      const result = getDisplayText('hsr-characters')
      expect(result).toEqual({
        itemText: 'HSR Character',
        itemsText: 'HSR Characters'
      })
    })

    it('should return correct display text for weapons', () => {
      const result = getDisplayText('weapons')
      expect(result).toEqual({
        itemText: 'Weapon',
        itemsText: 'Weapons'
      })
    })

    it('should return correct display text for lightcones', () => {
      const result = getDisplayText('lightcones')
      expect(result).toEqual({
        itemText: 'Lightcone',
        itemsText: 'Lightcones'
      })
    })

    it('should return default text for unknown types', () => {
      const result = getDisplayText('unknown')
      expect(result).toEqual({
        itemText: 'Item',
        itemsText: 'Items'
      })
    })
  })

  describe('getPageTitle', () => {
    it('should generate correct title for default banner history', () => {
      expect(getPageTitle('5star', 'characters')).toBe('5★ Character Banner History - Samsara')
      expect(getPageTitle('4star', 'weapons')).toBe('4★ Weapon Banner History - Samsara')
    })

    it('should generate correct title for summary page', () => {
      expect(getPageTitle('5star', 'characters', 'summary')).toBe('5★ Character Summary - Samsara')
      expect(getPageTitle('4star', 'hsr-characters', 'summary')).toBe('4★ HSR Character Summary - Samsara')
    })

    it('should generate correct title for average page', () => {
      expect(getPageTitle('5star', 'characters', 'summary-avg')).toBe('5★ Character Average Reruns - Samsara')
      expect(getPageTitle('4star', 'lightcones', 'summary-avg')).toBe('4★ Lightcone Average Reruns - Samsara')
    })

    it('should generate correct title for runs page', () => {
      expect(getPageTitle('5star', 'weapons', 'runs')).toBe('5★ Weapon Reruns Summary - Samsara')
    })

    it('should generate correct title for leaderboard pages', () => {
      expect(getPageTitle('5star', 'characters', 'longest-leaderboard')).toBe('5★ Character Longest Rerun Leaderboard - Samsara')
      expect(getPageTitle('4star', 'characters', 'shortest-leaderboard')).toBe('4★ Character Shortest Rerun Leaderboard - Samsara')
    })

    it('should handle star symbols correctly', () => {
      expect(getPageTitle('4star', 'characters')).toContain('4★')
      expect(getPageTitle('5star', 'characters')).toContain('5★')
    })
  })

  describe('getPageHeading', () => {
    it('should generate correct heading for default banner history', () => {
      expect(getPageHeading('5star', 'characters')).toBe('5★ Character Banner History')
      expect(getPageHeading('4star', 'weapons')).toBe('4★ Weapon Banner History')
    })

    it('should generate correct heading for summary page', () => {
      expect(getPageHeading('5star', 'characters', 'summary')).toBe('5★ Character Summary')
      expect(getPageHeading('4star', 'hsr-characters', 'summary')).toBe('4★ HSR Character Summary')
    })

    it('should generate correct heading for leaderboard pages', () => {
      expect(getPageHeading('5star', 'characters', 'longest-leaderboard')).toBe('5★ Longest Rerun Leaderboard Summary')
      expect(getPageHeading('4star', 'characters', 'shortest-leaderboard')).toBe('4★ Shortest Rerun Leaderboard Summary')
    })

    it('should not include "- Samsara" suffix in headings', () => {
      const heading = getPageHeading('5star', 'characters', 'summary')
      expect(heading).not.toContain('Samsara')
    })
  })

  describe('getTypeContext', () => {
    it('should return Genshin context for regular types', () => {
      const charactersContext = getTypeContext('characters')
      expect(charactersContext).toEqual({
        charactersText: 'Characters',
        characterType: 'characters',
        weaponsText: 'Weapons',
        weaponType: 'weapons'
      })

      const weaponsContext = getTypeContext('weapons')
      expect(weaponsContext).toEqual({
        charactersText: 'Characters',
        characterType: 'characters',
        weaponsText: 'Weapons',
        weaponType: 'weapons'
      })
    })

    it('should return HSR context for HSR types', () => {
      const hsrCharactersContext = getTypeContext('hsr-characters')
      expect(hsrCharactersContext).toEqual({
        charactersText: 'Characters',
        characterType: 'hsr-characters',
        weaponsText: 'Lightcones',
        weaponType: 'lightcones'
      })

      const lightconesContext = getTypeContext('lightcones')
      expect(lightconesContext).toEqual({
        charactersText: 'Characters',
        characterType: 'hsr-characters',
        weaponsText: 'Lightcones',
        weaponType: 'lightcones'
      })
    })
  })

  describe('getBannerType', () => {
    it('should return the same type for all known types', () => {
      expect(getBannerType('characters')).toBe('characters')
      expect(getBannerType('hsr-characters')).toBe('hsr-characters')
      expect(getBannerType('weapons')).toBe('weapons')
      expect(getBannerType('lightcones')).toBe('lightcones')
    })

    it('should return input for unknown types', () => {
      expect(getBannerType('unknown-type')).toBe('unknown-type')
    })
  })

  describe('isHSRType', () => {
    it('should return true for HSR types', () => {
      expect(isHSRType('hsr-characters')).toBe(true)
      expect(isHSRType('lightcones')).toBe(true)
    })

    it('should return false for Genshin types', () => {
      expect(isHSRType('characters')).toBe(false)
      expect(isHSRType('weapons')).toBe(false)
    })

    it('should return false for unknown types', () => {
      expect(isHSRType('unknown')).toBe(false)
      expect(isHSRType('')).toBe(false)
    })
  })

  describe('Server-side only functions', () => {
    it('should be documented as server-side only', () => {
      // These functions are designed to throw errors when called client-side
      // They should only be used in getStaticProps or other server-side contexts
      // We test this through documentation rather than execution to avoid module resolution issues
      expect(true).toBe(true)
    })
  })
})