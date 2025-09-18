import { describe, it, expect, vi, beforeEach } from 'vitest'
import fs from 'fs'
import YAML from 'yaml'
import LoadGenshinHistory, { LoadHSRHistory, LoadGenshinBanners, LoadHSRBanners } from '@/banners/history'
import type { BannerDataset, FeaturedHistory } from '@/banners/types'

// Mock fs module
vi.mock('fs')
const mockFs = vi.mocked(fs)

// Mock YAML module
vi.mock('yaml')
const mockYAML = vi.mocked(YAML)

describe('Banner History Module', () => {
  const mockBannerData: BannerDataset = {
    fiveStarCharacters: [
      {
        name: 'Test Character',
        versions: ['1.0', '1.1'],
        dates: [
          { start: '2023-01-01', end: '2023-01-21' },
          { start: '2023-02-01', end: '2023-02-21' }
        ]
      }
    ],
    fourStarCharacters: [
      {
        name: 'Test Four Star',
        versions: ['1.0'],
        dates: [{ start: '2023-01-01', end: '2023-01-21' }]
      }
    ],
    fiveStarWeapons: [],
    fourStarWeapons: []
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockFs.readFileSync.mockReturnValue('mock yaml content')
    mockYAML.parse.mockReturnValue(mockBannerData)
  })

  describe('LoadGenshinHistory', () => {
    it('should load and transform Genshin banner data into history format', () => {
      const result = LoadGenshinHistory()

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('public/data/banners.yaml'),
        'utf8'
      )
      expect(mockYAML.parse).toHaveBeenCalledWith('mock yaml content')
      
      // Verify the transformation removes dates and keeps versions
      expect(result.fiveStarCharacters).toEqual([
        {
          name: 'Test Character',
          versions: ['1.0', '1.1']
        }
      ])
      
      expect(result.fourStarCharacters).toEqual([
        {
          name: 'Test Four Star',
          versions: ['1.0']
        }
      ])
      
      expect(result.fiveStarWeapons).toEqual([])
      expect(result.fourStarWeapons).toEqual([])
    })

    it('should handle empty banner datasets', () => {
      const emptyData: BannerDataset = {
        fiveStarCharacters: [],
        fourStarCharacters: [],
        fiveStarWeapons: [],
        fourStarWeapons: []
      }
      
      mockYAML.parse.mockReturnValue(emptyData)
      
      const result = LoadGenshinHistory()
      
      expect(result.fiveStarCharacters).toEqual([])
      expect(result.fourStarCharacters).toEqual([])
      expect(result.fiveStarWeapons).toEqual([])
      expect(result.fourStarWeapons).toEqual([])
    })
  })

  describe('LoadHSRHistory', () => {
    it('should load HSR banner data from correct file path', () => {
      LoadHSRHistory()

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('public/data/hsr-banners.yaml'),
        'utf8'
      )
    })

    it('should transform HSR data the same way as Genshin data', () => {
      const result = LoadHSRHistory()

      expect(result.fiveStarCharacters).toEqual([
        {
          name: 'Test Character',
          versions: ['1.0', '1.1']
        }
      ])
    })
  })

  describe('LoadGenshinBanners', () => {
    it('should return raw banner data without transformation', () => {
      const result = LoadGenshinBanners()

      expect(result).toEqual(mockBannerData)
      expect(result.fiveStarCharacters[0]).toHaveProperty('dates')
    })
  })

  describe('LoadHSRBanners', () => {
    it('should return raw HSR banner data without transformation', () => {
      const result = LoadHSRBanners()

      expect(mockFs.readFileSync).toHaveBeenCalledWith(
        expect.stringContaining('public/data/hsr-banners.yaml'),
        'utf8'
      )
      expect(result).toEqual(mockBannerData)
    })
  })

  describe('Error handling', () => {
    it('should handle file read errors gracefully', () => {
      mockFs.readFileSync.mockImplementation(() => {
        throw new Error('File not found')
      })

      expect(() => LoadGenshinHistory()).toThrow('File not found')
    })

    it('should handle YAML parse errors gracefully', () => {
      mockYAML.parse.mockImplementation(() => {
        throw new Error('Invalid YAML')
      })

      expect(() => LoadGenshinHistory()).toThrow('Invalid YAML')
    })
  })
})