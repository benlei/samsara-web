import { describe, it, expect } from 'vitest'
import { getImageFromName } from '@/format/image'

describe('Image Format Module', () => {
  describe('getImageFromName', () => {
    it('should replace spaces with hyphens', () => {
      expect(getImageFromName('Hu Tao')).toBe('Hu-Tao')
      expect(getImageFromName('Kaedehara Kazuha')).toBe('Kaedehara-Kazuha')
      expect(getImageFromName('Raiden Shogun')).toBe('Raiden-Shogun')
    })

    it('should remove special characters', () => {
      expect(getImageFromName("Zhong'li")).toBe('Zhongli')
      expect(getImageFromName('Kamisato Ayaka!')).toBe('Kamisato-Ayaka')
      expect(getImageFromName('Chongyun (character)')).toBe('Chongyun-character')
      expect(getImageFromName('Character #1')).toBe('Character-1')
    })

    it('should handle multiple consecutive hyphens', () => {
      expect(getImageFromName('Name---With--Many-Hyphens')).toBe('Name-With-Many-Hyphens')
      expect(getImageFromName('Test  Multiple  Spaces')).toBe('Test-Multiple-Spaces')
      expect(getImageFromName('Mixed--- ---Characters')).toBe('Mixed-Characters')
    })

    it('should preserve alphanumeric characters', () => {
      expect(getImageFromName('Character123')).toBe('Character123')
      expect(getImageFromName('ABC123xyz')).toBe('ABC123xyz')
      expect(getImageFromName('Version 2.0')).toBe('Version-20')
    })

    it('should handle empty and single character strings', () => {
      expect(getImageFromName('')).toBe('')
      expect(getImageFromName('A')).toBe('A')
      expect(getImageFromName(' ')).toBe('-') // Space becomes hyphen
      expect(getImageFromName('-')).toBe('-') // Hyphen stays hyphen
    })

    it('should handle strings with only special characters', () => {
      expect(getImageFromName('!@#$%^&*()')).toBe('')
      expect(getImageFromName('---')).toBe('-') // Multiple hyphens become single hyphen
      expect(getImageFromName('!!! @@@')).toBe('-') // Special chars with space become hyphen
    })

    it('should handle mixed case consistently', () => {
      expect(getImageFromName('AlBeDo')).toBe('AlBeDo')
      expect(getImageFromName('ZHONGLI')).toBe('ZHONGLI')
      expect(getImageFromName('vEnTi')).toBe('vEnTi')
    })

    it('should handle real character names correctly', () => {
      // Test with actual Genshin Impact character names
      expect(getImageFromName('Albedo')).toBe('Albedo')
      expect(getImageFromName('Arataki Itto')).toBe('Arataki-Itto')
      expect(getImageFromName("Hu Tao")).toBe('Hu-Tao')
      expect(getImageFromName('Jean')).toBe('Jean')
      expect(getImageFromName('Kaedehara Kazuha')).toBe('Kaedehara-Kazuha')
      expect(getImageFromName('Kamisato Ayaka')).toBe('Kamisato-Ayaka')
      expect(getImageFromName('Kamisato Ayato')).toBe('Kamisato-Ayato')
      expect(getImageFromName('Raiden Shogun')).toBe('Raiden-Shogun')
      expect(getImageFromName('Sangonomiya Kokomi')).toBe('Sangonomiya-Kokomi')
      expect(getImageFromName('Tartaglia')).toBe('Tartaglia')
      expect(getImageFromName('Venti')).toBe('Venti')
      expect(getImageFromName('Xiao')).toBe('Xiao')
      expect(getImageFromName('Zhongli')).toBe('Zhongli')
    })

    it('should handle weapon names correctly', () => {
      // Test with weapon names that might have special characters
      expect(getImageFromName('Wolf\'s Gravestone')).toBe('Wolfs-Gravestone')
      expect(getImageFromName('Staff of Homa')).toBe('Staff-of-Homa')
      expect(getImageFromName('Primordial Jade Winged-Spear')).toBe('Primordial-Jade-Winged-Spear')
      expect(getImageFromName('Mistsplitter Reforged')).toBe('Mistsplitter-Reforged')
    })

    it('should handle edge cases with numbers and letters', () => {
      expect(getImageFromName('R5 Weapon')).toBe('R5-Weapon')
      expect(getImageFromName('Level 90')).toBe('Level-90')
      expect(getImageFromName('Constellation C6')).toBe('Constellation-C6')
    })

    it('should be consistent and deterministic', () => {
      const testName = 'Test!!! Character@@@'
      const result1 = getImageFromName(testName)
      const result2 = getImageFromName(testName)
      
      expect(result1).toBe(result2)
      expect(result1).toBe('Test-Character')
    })

    it('should handle Unicode characters (remove them)', () => {
      expect(getImageFromName('Test 你好')).toBe('Test-')
      expect(getImageFromName('Character ñ')).toBe('Character-')
      expect(getImageFromName('Test émoji 😀')).toBe('Test-moji-')
    })

    it('should produce web-safe filenames', () => {
      const testNames = [
        'Hu Tao',
        'Kamisato Ayaka', 
        'Character!@#',
        'Test---Name',
        'Multiple   Spaces'
      ]

      testNames.forEach(name => {
        const result = getImageFromName(name)
        // Should only contain alphanumeric characters and hyphens
        expect(result).toMatch(/^[a-zA-Z0-9-]*$/)
        // Should not have consecutive hyphens
        expect(result).not.toMatch(/--/)
      })
    })
  })
})