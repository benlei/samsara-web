import { describe, it, expect, vi, beforeEach } from 'vitest'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import {
  getColorClassName,
  getPercent,
  getFilterFunction,
  getPatchGap,
  getBannerGap
} from '@/banners/summary'
import type { VersionParts } from '@/banners/types'

dayjs.extend(utc)

describe('Summary Module', () => {
  describe('getColorClassName', () => {
    it('should return correct color class for different percentage ranges', () => {
      expect(getColorClassName(90)).toBe('dark-9') // >= 85
      expect(getColorClassName(85)).toBe('dark-9') // >= 85
      expect(getColorClassName(80)).toBe('dark-8') // >= 70
      expect(getColorClassName(70)).toBe('dark-8') // >= 70
      expect(getColorClassName(60)).toBe('dark-7') // >= 55
      expect(getColorClassName(55)).toBe('dark-7') // >= 55
      expect(getColorClassName(50)).toBe('dark-6') // >= 40
      expect(getColorClassName(40)).toBe('dark-6') // >= 40
      expect(getColorClassName(30)).toBe('dark-5') // >= 25
      expect(getColorClassName(25)).toBe('dark-5') // >= 25
      expect(getColorClassName(20)).toBe('dark-4') // < 25
      expect(getColorClassName(0)).toBe('dark-4') // < 25
    })

    it('should handle edge cases and boundary values', () => {
      expect(getColorClassName(84.99)).toBe('dark-8')
      expect(getColorClassName(85.01)).toBe('dark-9')
      expect(getColorClassName(-5)).toBe('dark-4')
      expect(getColorClassName(100)).toBe('dark-9')
    })
  })

  describe('getPercent', () => {
    it('should calculate percentage correctly for positive numbers', () => {
      expect(getPercent(50, 100)).toBe(50)
      expect(getPercent(1, 4)).toBe(25)
      expect(getPercent(3, 4)).toBe(75)
      expect(getPercent(100, 100)).toBe(100)
    })

    it('should handle zero and negative numerators', () => {
      expect(getPercent(0, 100)).toBe(0.5) // Minimum 0.5
      expect(getPercent(-10, 100)).toBe(0) // Negative returns 0
      expect(getPercent(-1, 50)).toBe(0)
    })

    it('should handle zero and small denominators', () => {
      expect(getPercent(50, 0)).toBe(5000) // 50/1 * 100 when denom is 0
      expect(getPercent(10, 1)).toBe(1000)
      expect(getPercent(1, 1)).toBe(100)
    })

    it('should ensure minimum percentage of 0.5', () => {
      expect(getPercent(1, 1000)).toBe(0.5) // 0.1 rounded up to 0.5
      expect(getPercent(1, 10000)).toBe(0.5)
    })

    it('should handle edge cases', () => {
      expect(getPercent(0, 0)).toBe(0.5) // 0/1 * 100 = 0, but min is 0.5
      expect(getPercent(-5, -10)).toBe(0) // Negative numerator returns 0
    })
  })

  describe('getFilterFunction', () => {
    const testData = [
      { name: 'Albedo', versions: ['1.2', '2.3'] },
      { name: 'Zhongli', versions: ['1.1', '1.5'] },
      { name: 'Venti', versions: ['1.0', '1.4'] },
      { name: 'Childe', versions: ['1.1', '1.4', '2.2'] },
      { name: 'Hu Tao', versions: ['1.3', '2.2'] },
      { name: 'Test Luna', versions: ['Luna I', 'Luna II'] }
    ]

    it('should return function that always returns true for empty filter', () => {
      const filterFn = getFilterFunction('')
      expect(testData.every(filterFn)).toBe(true)

      const filterFnSpaces = getFilterFunction('   ')
      expect(testData.every(filterFnSpaces)).toBe(true)
    })

    it('should filter by character name (case insensitive)', () => {
      const filterFn = getFilterFunction('albedo')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Albedo')
    })

    it('should filter by partial name match', () => {
      const filterFn = getFilterFunction('hu')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(1) // Only 'Hu Tao' contains 'hu'
      expect(results.map(r => r.name)).toEqual(['Hu Tao'])
    })

    it('should filter by version number', () => {
      const filterFn = getFilterFunction('1.1')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(2) // Zhongli and Childe both have 1.1
      expect(results.map(r => r.name)).toEqual(expect.arrayContaining(['Zhongli', 'Childe']))
    })

    it('should filter by version prefix', () => {
      const filterFn = getFilterFunction('1')
      const results = testData.filter(filterFn)
      
      // Should match all characters with versions starting with '1.'
      expect(results).toHaveLength(5) // All except Luna character
      expect(results.map(r => r.name)).not.toContain('Test Luna')
    })

    it('should filter by Luna versions', () => {
      const filterFn = getFilterFunction('luna')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(1)
      expect(results[0].name).toBe('Test Luna')
    })

    it('should handle multiple filters separated by commas', () => {
      const filterFn = getFilterFunction('albedo,venti')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(2)
      expect(results.map(r => r.name)).toEqual(expect.arrayContaining(['Albedo', 'Venti']))
    })

    it('should handle mixed name and version filters', () => {
      const filterFn = getFilterFunction('albedo,1.1')
      const results = testData.filter(filterFn)
      
      // Should match Albedo (by name) and Zhongli/Childe (by version 1.1)
      expect(results).toHaveLength(3)
      expect(results.map(r => r.name)).toEqual(expect.arrayContaining(['Albedo', 'Zhongli', 'Childe']))
    })

    it('should ignore invalid version formats', () => {
      const filterFn = getFilterFunction('invalid-version')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(0)
    })

    it('should handle whitespace in filters', () => {
      const filterFn = getFilterFunction(' albedo , venti ')
      const results = testData.filter(filterFn)
      
      expect(results).toHaveLength(2)
      expect(results.map(r => r.name)).toEqual(expect.arrayContaining(['Albedo', 'Venti']))
    })
  })

  describe('getPatchGap', () => {
    const versionParts: VersionParts[] = [
      { version: '1.0', parts: 2 },
      { version: '1.1', parts: 2 },
      { version: '1.2', parts: 2 },
      { version: '2.0', parts: 3 },
      { version: '2.1', parts: 2 }
    ]

    it('should return 0 for same base version', () => {
      // Both '1.0.1' and '1.1.1' have base version '1.0' and '1.1' respectively
      // The function looks for exact base version matches in versionParts
      expect(getPatchGap(versionParts, '1.0.1', '1.0.2')).toBe(0) // Same base version '1.0'
    })

    it('should return 0 for same version', () => {
      expect(getPatchGap(versionParts, '1.1.1', '1.1.1')).toBe(0) // Same base version '1.1'
    })

    it('should calculate difference between different base versions', () => {
      // '1.0.1' -> base '1.0' (index 0), '1.2.1' -> base '1.2' (index 2)
      expect(getPatchGap(versionParts, '1.0.1', '1.2.1')).toBe(2) // index 2 - index 0 = 2
    })

    it('should handle major version differences', () => {
      // '1.0.1' -> base '1.0' (index 0), '2.0.1' -> base '2.0' (index 3)
      expect(getPatchGap(versionParts, '1.0.1', '2.0.1')).toBe(3) // index 3 - index 0 = 3
    })
  })

  describe('getBannerGap', () => {
    const versionParts: VersionParts[] = [
      { version: '1.0', parts: 2 }, // 1.0.1, 1.0.2
      { version: '1.1', parts: 2 }, // 1.1.1, 1.1.2  
      { version: '1.2', parts: 2 }, // 1.2.1, 1.2.2
      { version: '2.0', parts: 3 }  // 2.0.1, 2.0.2, 2.0.3
    ]

    it('should calculate banner gap within same version', () => {
      expect(getBannerGap(versionParts, '1.0.1', '1.0.2')).toBe(0) // No gap between consecutive parts
    })

    it('should calculate banner gap across versions', () => {
      expect(getBannerGap(versionParts, '1.0.1', '1.1.1')).toBe(1) // 1.0.2 is skipped
      expect(getBannerGap(versionParts, '1.0.2', '1.1.1')).toBe(0) // Direct transition
    })

    it('should calculate banner gap across major versions', () => {
      // From 1.2.1 to 2.0.1: skip 1.2.2, then 2.0.0 (implicit), so gap is 1
      expect(getBannerGap(versionParts, '1.2.1', '2.0.1')).toBe(1)
    })

    it('should handle complex multi-version gaps', () => {
      // From 1.0.1 to 2.0.2: skip 1.0.2, 1.1.1, 1.1.2, 1.2.1, 1.2.2, 2.0.1
      expect(getBannerGap(versionParts, '1.0.1', '2.0.2')).toBe(6)
    })

    it('should return 0 for same version', () => {
      expect(getBannerGap(versionParts, '1.1.1', '1.1.1')).toBe(-1) // Same banner has gap of -1
    })
  })

  describe('Edge cases and error handling', () => {
    it('should handle malformed inputs gracefully', () => {
      expect(() => getColorClassName(NaN)).not.toThrow()
      expect(() => getPercent(NaN, 100)).not.toThrow()
      expect(() => getFilterFunction('')).not.toThrow()
    })

    it('should handle extreme values', () => {
      expect(getPercent(Number.MAX_VALUE, 1)).toBe(Number.MAX_VALUE * 100)
      expect(getColorClassName(Number.MAX_VALUE)).toBe('dark-9')
    })
  })
})