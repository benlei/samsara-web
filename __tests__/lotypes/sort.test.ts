import { describe, it, expect } from 'vitest'
import type { Order } from '../../lotypes/sort'

describe('Sort Types Module', () => {
  describe('Order type', () => {
    it('should accept boolean values', () => {
      const ascOrder: Order = true
      const descOrder: Order = false
      
      expect(typeof ascOrder).toBe('boolean')
      expect(typeof descOrder).toBe('boolean')
    })

    it('should accept string values', () => {
      const ascOrder: Order = 'asc'
      const descOrder: Order = 'desc'
      
      expect(ascOrder).toBe('asc')
      expect(descOrder).toBe('desc')
    })

    it('should be a union type that works with conditionals', () => {
      function getSortDirection(order: Order): string {
        if (order === true || order === 'asc') {
          return 'ascending'
        } else if (order === false || order === 'desc') {
          return 'descending'
        }
        return 'unknown'
      }

      expect(getSortDirection(true)).toBe('ascending')
      expect(getSortDirection('asc')).toBe('ascending')
      expect(getSortDirection(false)).toBe('descending')
      expect(getSortDirection('desc')).toBe('descending')
    })

    it('should work in array of sort configurations', () => {
      interface SortConfig {
        field: string
        order: Order
      }

      const sortConfigs: SortConfig[] = [
        { field: 'name', order: 'asc' },
        { field: 'date', order: 'desc' },
        { field: 'priority', order: true },
        { field: 'status', order: false }
      ]

      expect(sortConfigs).toHaveLength(4)
      expect(sortConfigs[0].order).toBe('asc')
      expect(sortConfigs[1].order).toBe('desc')
      expect(sortConfigs[2].order).toBe(true)
      expect(sortConfigs[3].order).toBe(false)
    })

    it('should be compatible with lodash orderBy function signature', () => {
      // Simulate how this might be used with lodash orderBy
      function mockOrderBy(collection: any[], iteratees: any[], orders: Order[]): any[] {
        // Mock implementation - just return the collection for testing
        expect(orders.every(order => 
          order === 'asc' || order === 'desc' || typeof order === 'boolean'
        )).toBe(true)
        return collection
      }

      const testData = [{ name: 'A' }, { name: 'B' }]
      const orders: Order[] = ['asc', 'desc', true, false]
      
      const result = mockOrderBy(testData, ['name'], orders)
      expect(result).toEqual(testData)
    })

    it('should work in type guards', () => {
      function isStringOrder(order: Order): order is 'asc' | 'desc' {
        return typeof order === 'string'
      }

      function isBooleanOrder(order: Order): order is boolean {
        return typeof order === 'boolean'
      }

      const stringOrder: Order = 'asc'
      const booleanOrder: Order = true

      expect(isStringOrder(stringOrder)).toBe(true)
      expect(isStringOrder(booleanOrder)).toBe(false)
      expect(isBooleanOrder(stringOrder)).toBe(false)
      expect(isBooleanOrder(booleanOrder)).toBe(true)
    })
  })

  describe('Type behavior and usage patterns', () => {
    it('should maintain type safety in functions', () => {
      function processOrder(order: Order): 'up' | 'down' {
        switch (order) {
          case 'asc':
          case true:
            return 'up'
          case 'desc':
          case false:
            return 'down'
          default:
            // TypeScript should know this is never reached
            const _exhaustive: never = order
            return 'up'
        }
      }

      expect(processOrder('asc')).toBe('up')
      expect(processOrder('desc')).toBe('down')
      expect(processOrder(true)).toBe('up')
      expect(processOrder(false)).toBe('down')
    })

    it('should work with default parameters', () => {
      function sortWithDefault(data: string[], order: Order = 'asc'): string[] {
        const ascending = order === 'asc' || order === true
        return ascending ? [...data].sort() : [...data].sort().reverse()
      }

      const testData = ['c', 'a', 'b']
      
      expect(sortWithDefault(testData)).toEqual(['a', 'b', 'c']) // Default 'asc'
      expect(sortWithDefault(testData, 'asc')).toEqual(['a', 'b', 'c'])
      expect(sortWithDefault(testData, 'desc')).toEqual(['c', 'b', 'a'])
      expect(sortWithDefault(testData, true)).toEqual(['a', 'b', 'c'])
      expect(sortWithDefault(testData, false)).toEqual(['c', 'b', 'a'])
    })

    it('should work in object configurations', () => {
      interface SortOptions {
        orders: Order[]
        primaryOrder: Order
        fallbackOrder?: Order
      }

      const config: SortOptions = {
        orders: ['asc', 'desc', true, false],
        primaryOrder: 'asc',
        fallbackOrder: false
      }

      expect(config.orders).toHaveLength(4)
      expect(config.primaryOrder).toBe('asc')
      expect(config.fallbackOrder).toBe(false)
    })
  })
})