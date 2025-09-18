import { describe, it, expect, vi } from 'vitest'
import { getRundowns } from '@/banners/rundown'
import type { FeaturedHistory, VersionParts } from '@/banners/types'

describe('Rundown Module', () => {
  describe('getRundowns', () => {
    it('should transform featured history into detailed rundown format', () => {
      const featuredList: FeaturedHistory[] = [
        {
          name: 'Venti',
          versions: ['1.0.1', '1.2.1']
        },
        {
          name: 'Zhongli',
          versions: ['1.1.1']
        }
      ]

      const result = getRundowns(featuredList)

      expect(result).toHaveLength(2)
      
      // Check first character (Venti)
      expect(result[0]).toMatchObject({
        name: 'Venti',
        image: 'Venti',
        runs: 2,
        versions: ['1.0.1', '1.2.1']
      })
      expect(result[0].counter).toBeInstanceOf(Array)

      // Check second character (Zhongli)
      expect(result[1]).toMatchObject({
        name: 'Zhongli',
        image: 'Zhongli',
        runs: 1,
        versions: ['1.1.1']
      })
      expect(result[1].counter).toBeInstanceOf(Array)
    })

    it('should handle empty featured list', () => {
      const result = getRundowns([])
      expect(result).toEqual([])
    })

    it('should handle single character with single version', () => {
      const featuredList: FeaturedHistory[] = [
        {
          name: 'Albedo',
          versions: ['1.2.1']
        }
      ]

      const result = getRundowns(featuredList)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        name: 'Albedo',
        image: 'Albedo',
        runs: 1,
        versions: ['1.2.1']
      })
      expect(result[0].counter).toBeInstanceOf(Array)
    })

    it('should handle characters with multiple reruns', () => {
      const featuredList: FeaturedHistory[] = [
        {
          name: 'Childe',
          versions: ['1.1.1', '1.4.1', '2.2.1', '4.0.1']
        }
      ]

      const result = getRundowns(featuredList)

      expect(result).toHaveLength(1)
      expect(result[0]).toMatchObject({
        name: 'Childe',
        image: 'Childe',
        runs: 4,
        versions: ['1.1.1', '1.4.1', '2.2.1', '4.0.1']
      })
      expect(result[0].counter).toBeInstanceOf(Array)
    })

    it('should handle characters with special names containing spaces', () => {
      const featuredList: FeaturedHistory[] = [
        {
          name: 'Hu Tao',
          versions: ['1.3.1']
        },
        {
          name: 'Kaedehara Kazuha',
          versions: ['1.6.1']
        }
      ]

      const result = getRundowns(featuredList)

      expect(result).toHaveLength(2)
      expect(result[0].image).toBe('Hu-Tao')
      expect(result[1].image).toBe('Kaedehara-Kazuha')
    })

    it('should maintain order of input list', () => {
      const featuredList: FeaturedHistory[] = [
        { name: 'Third', versions: ['1.0.1'] },
        { name: 'First', versions: ['1.1.1'] },
        { name: 'Second', versions: ['1.2.1'] }
      ]

      const result = getRundowns(featuredList)

      expect(result.map(r => r.name)).toEqual(['Third', 'First', 'Second'])
    })

    it('should properly calculate runs count for each character', () => {
      const featuredList: FeaturedHistory[] = [
        { name: 'Single Run', versions: ['1.0.1'] },
        { name: 'Double Run', versions: ['1.0.1', '1.1.1'] },
        { name: 'Triple Run', versions: ['1.0.1', '1.1.1', '1.2.1'] }
      ]

      const result = getRundowns(featuredList)

      expect(result[0].runs).toBe(1)
      expect(result[1].runs).toBe(2)
      expect(result[2].runs).toBe(3)
    })
  })

  describe('Rundown counter behavior', () => {
    it('should generate counter arrays that reflect banner timing', () => {
      const featuredList: FeaturedHistory[] = [
        {
          name: 'Test Character',
          versions: ['1.0.1', '1.2.1']
        }
      ]

      const result = getRundowns(featuredList)

      // Counter should be an array reflecting when character was/wasn't featured
      expect(result[0].counter).toBeInstanceOf(Array)
      expect(result[0].counter.length).toBeGreaterThan(0)
      
      // Should contain numbers (representing wait times/counters)
      expect(result[0].counter.every((c: number) => typeof c === 'number')).toBe(true)
    })

    it('should handle edge case with very early versions', () => {
      const featuredList: FeaturedHistory[] = [
        {
          name: 'Early Character',
          versions: ['1.0.1']
        }
      ]

      expect(() => getRundowns(featuredList)).not.toThrow()
    })
  })
})