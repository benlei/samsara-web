import { describe, it, expect } from 'vitest'
import { chunk } from '@/banners/summaryUtils'

describe('Summary Utils Module', () => {
  describe('chunk function', () => {
    it('should group items by the result of byFn', () => {
      interface TestItem {
        id: number
        category: string
      }

      const items: TestItem[] = [
        { id: 1, category: 'A' },
        { id: 2, category: 'A' },
        { id: 3, category: 'B' },
        { id: 4, category: 'B' },
        { id: 5, category: 'A' },
        { id: 6, category: 'A' }
      ]

      const result = chunk(items, item => item.category)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual([
        { id: 1, category: 'A' },
        { id: 2, category: 'A' }
      ])
      expect(result[1]).toEqual([
        { id: 3, category: 'B' },
        { id: 4, category: 'B' }
      ])
      expect(result[2]).toEqual([
        { id: 5, category: 'A' },
        { id: 6, category: 'A' }
      ])
    })

    it('should handle numeric grouping', () => {
      const numbers = [1, 1, 1, 2, 2, 3, 3, 3, 3]
      const result = chunk(numbers, n => n)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual([1, 1, 1])
      expect(result[1]).toEqual([2, 2])
      expect(result[2]).toEqual([3, 3, 3, 3])
    })

    it('should handle single item groups', () => {
      const items = [
        { type: 'A' },
        { type: 'B' },
        { type: 'C' }
      ]

      const result = chunk(items, item => item.type)

      expect(result).toHaveLength(3)
      expect(result[0]).toEqual([{ type: 'A' }])
      expect(result[1]).toEqual([{ type: 'B' }])
      expect(result[2]).toEqual([{ type: 'C' }])
    })

    it('should handle all items having the same group', () => {
      const items = [
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ]

      const result = chunk(items, () => 'same')

      expect(result).toHaveLength(1)
      expect(result[0]).toEqual([
        { value: 1 },
        { value: 2 },
        { value: 3 }
      ])
    })

    it('should return empty array for empty input', () => {
      const result = chunk([], (x: any) => x)

      expect(result).toEqual([])
    })

    it('should handle complex grouping functions', () => {
      interface Person {
        name: string
        age: number
      }

      const people: Person[] = [
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 25 },
        { name: 'Charlie', age: 30 },
        { name: 'David', age: 30 },
        { name: 'Eve', age: 25 }
      ]

      const result = chunk(people, person => Math.floor(person.age / 10))

      expect(result).toHaveLength(3) // Two groups of 20s, one group of 30s, one more group of 20s
      expect(result[0]).toEqual([
        { name: 'Alice', age: 25 },
        { name: 'Bob', age: 25 }
      ])
      expect(result[1]).toEqual([
        { name: 'Charlie', age: 30 },
        { name: 'David', age: 30 }
      ])
      expect(result[2]).toEqual([
        { name: 'Eve', age: 25 }
      ])
    })

    it('should preserve order within chunks', () => {
      const items = [
        { id: 5, group: 'A' },
        { id: 3, group: 'A' },
        { id: 8, group: 'B' },
        { id: 1, group: 'B' }
      ]

      const result = chunk(items, item => item.group)

      expect(result[0]).toEqual([
        { id: 5, group: 'A' },
        { id: 3, group: 'A' }
      ])
      expect(result[1]).toEqual([
        { id: 8, group: 'B' },
        { id: 1, group: 'B' }
      ])
    })

    it('should handle string and number return types from byFn', () => {
      const mixedData = [
        { value: 'hello' },
        { value: 'hello' },
        { value: 'world' }
      ]

      const stringResult = chunk(mixedData, item => item.value)
      expect(stringResult).toHaveLength(2)

      const numberData = [1, 1, 2, 2, 3]
      const numberResult = chunk(numberData, x => x * 2)
      expect(numberResult).toHaveLength(3)
    })
  })
})