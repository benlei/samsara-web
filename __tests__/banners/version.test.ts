import { describe, it, expect } from 'vitest'
import { getBaseVersion, getVersionPart, versionToNumber } from '../../banners/version'

describe('Version Module', () => {
  describe('getBaseVersion', () => {
    it('should extract base version from standard version strings', () => {
      expect(getBaseVersion('1.2.3')).toBe('1.2')
      expect(getBaseVersion('4.5.1')).toBe('4.5')
      expect(getBaseVersion('10.20.5')).toBe('10.20')
    })

    it('should handle single digit versions', () => {
      expect(getBaseVersion('1.0.1')).toBe('1.0')
      expect(getBaseVersion('2.1.0')).toBe('2.1')
    })

    it('should handle edge cases', () => {
      expect(getBaseVersion('1.2')).toBe('1')
      expect(getBaseVersion('0.0.1')).toBe('0.0')
    })
  })

  describe('getVersionPart', () => {
    it('should extract the last part of version strings', () => {
      expect(getVersionPart('1.2.3')).toBe(3)
      expect(getVersionPart('4.5.1')).toBe(1)
      expect(getVersionPart('10.20.5')).toBe(5)
    })

    it('should handle zero values', () => {
      expect(getVersionPart('1.2.0')).toBe(0)
      expect(getVersionPart('0.0.1')).toBe(1)
    })

    it('should handle single digit values', () => {
      expect(getVersionPart('1.0.5')).toBe(5)
      expect(getVersionPart('2.1.9')).toBe(9)
    })
  })

  describe('versionToNumber', () => {
    it('should convert standard versions to sortable numbers', () => {
      expect(versionToNumber('1.0.0')).toBe(10000)
      expect(versionToNumber('1.0.1')).toBe(10001)
      expect(versionToNumber('1.1.0')).toBe(10100)
      expect(versionToNumber('2.0.0')).toBe(20000)
    })

    it('should maintain correct sort order for standard versions', () => {
      const versions = ['1.0.0', '1.0.1', '1.1.0', '1.1.1', '2.0.0']
      const numbers: number[] = versions.map(versionToNumber)
      
      for (let i = 0; i < numbers.length - 1; i++) {
        expect(numbers[i]).toBeLessThan(numbers[i + 1])
      }
    })

    it('should handle Luna versions correctly', () => {
      expect(versionToNumber('Luna I')).toBe(50900) // 5.9 equivalent
      expect(versionToNumber('Luna II')).toBe(51000) // 5.10 equivalent
      expect(versionToNumber('Luna III')).toBe(51100) // 5.11 equivalent
      expect(versionToNumber('Luna VIII')).toBe(51600) // 5.16 equivalent
    })

    it('should maintain correct sort order including Luna versions', () => {
      const versions = ['5.8.0', 'Luna I', 'Luna II', 'Luna VIII']
      const numbers: number[] = versions.map(versionToNumber)
      
      expect(numbers[0]).toBe(50800) // 5.8.0
      expect(numbers[1]).toBe(50900) // Luna I
      expect(numbers[2]).toBe(51000) // Luna II
      expect(numbers[3]).toBe(51600) // Luna VIII
      
      // Verify order
      for (let i = 0; i < numbers.length - 1; i++) {
        expect(numbers[i]).toBeLessThan(numbers[i + 1])
      }
    })

    it('should handle complex version numbers', () => {
      expect(versionToNumber('10.20.30')).toBe(102030)
      expect(versionToNumber('0.1.2')).toBe(102)
    })

    it('should handle invalid versions gracefully', () => {
      expect(versionToNumber('invalid')).toBe(Number.MAX_SAFE_INTEGER)
      expect(versionToNumber('1.x.3')).toBe(Number.MAX_SAFE_INTEGER)
      expect(versionToNumber('')).toBe(Number.MAX_SAFE_INTEGER)
    })

    it('should handle Luna versions with additional parts', () => {
      expect(versionToNumber('Luna I.1')).toBe(50900) // Should still process Luna I part
      expect(versionToNumber('Luna V.2')).toBe(51300) // Luna V = 5.13
    })

    it('should handle edge cases for Luna versions', () => {
      expect(versionToNumber('Luna')).toBe(Number.MAX_SAFE_INTEGER) // Missing Roman numeral
      expect(versionToNumber('Luna IX')).toBe(Number.MAX_SAFE_INTEGER) // Roman numeral not in mapping, should return MAX_SAFE_INTEGER
    })
  })

  describe('Version processing edge cases', () => {
    it('should handle empty and malformed inputs consistently', () => {
      expect(() => getBaseVersion('')).not.toThrow()
      expect(() => getVersionPart('')).not.toThrow()
      expect(() => versionToNumber('')).not.toThrow()
    })

    it('should process versions with leading zeros', () => {
      expect(getVersionPart('1.0.01')).toBe(1)
      expect(getVersionPart('1.0.05')).toBe(5)
    })
  })
})