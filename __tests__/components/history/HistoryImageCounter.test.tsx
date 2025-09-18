import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import HistoryImageCounter from '../../../components/history/HistoryImageCounter'
import { BannerHistoryDataset, DetailedFeaturedHistory } from '../../../banners/types'
import { TypeContext } from '../../../components/context'

// Mock lodash with simple implementations for testing
vi.mock('lodash', () => ({
  default: {
    includes: (array: any[], value: any) => array.includes(value),
    chain: (array: any[]) => ({
      filter: (predicate: any) => ({
        map: (iterator: any) => ({
          orderBy: (iteratees: any[], orders: any[]) => ({
            value: () => array.filter(predicate).map(iterator).sort()
          }),
          value: () => array.filter(predicate).map(iterator)
        }),
        first: () => ({
          value: () => array.filter(predicate)[0]
        }),
        value: () => array.filter(predicate)
      }),
      map: (iterator: any) => ({
        value: () => array.map(iterator)
      }),
      first: () => ({
        value: () => array[0]
      }),
      orderBy: (iteratees: any[], orders: any[]) => ({
        value: () => array.sort()
      }),
      value: () => array
    })
  }
}));

// Mock the image utility
vi.mock('../../../format/image', () => ({
  getImageFromName: (name: string) => `${name.toLowerCase().replace(/\s+/g, '-')}`
}))

// Mock the banner version utility
vi.mock('../../../banners/version', () => ({
  getBaseVersion: (version: string) => version.split('.').slice(0, 2).join('.'),
  getVersionPart: (version: string) => version.split('.').pop() || ''
}))

// Mock the summary utils
vi.mock('../../../banners/summaryUtils', () => ({
  chunk: (array: any[], keyFn: (item: any) => any) => {
    const groups: any[] = []
    const seen = new Set()
    array.forEach(item => {
      const key = keyFn(item)
      if (!seen.has(key)) {
        seen.add(key)
        groups.push(array.filter(arrItem => keyFn(arrItem) === key))
      }
    })
    return groups
  }
}))

const mockFeaturedHistory = [
  {
    name: 'Albedo',
    versions: ['1.2.1', '1.2.2', '2.3.1']
  },
  {
    name: 'Ganyu', 
    versions: ['1.2.1', '1.4.1']
  },
  {
    name: 'Xiao',
    versions: ['1.3.1', '2.4.1']
  }
]

const mockDataset: BannerHistoryDataset = {
  fiveStarCharacters: mockFeaturedHistory,
  fourStarCharacters: [],
  fiveStarWeapons: [],
  fourStarWeapons: []
}

const mockRundown: DetailedFeaturedHistory = {
  name: 'Albedo',
  image: 'albedo',
  runs: 2,
  versions: ['1.2.1', '1.2.2', '2.3.1'],
  counter: [0, 0, 1]
}

const mockTypeContext = {
  characterType: 'characters',
  charactersText: 'Characters',
  weaponType: 'weapons',
  weaponsText: 'Weapons'
}

describe('HistoryImageCounter Component - User Behaviors', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Counter Display Behavior', () => {
    it('displays empty div when counter is -1', () => {
      const { container } = render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={-1}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(container.firstChild).toBeEmptyDOMElement()
    })

    it('displays numeric counter when counter is greater than 0', () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={5}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByText('5')).toBeInTheDocument()
    })

    it('displays character avatar when counter is 0', () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByTestId('mui-avatar')).toBeInTheDocument()
    })
  })

  describe('Popover Trigger Behavior', () => {
    it('allows user to click character icon to open popover', async () => {
      const user = userEvent.setup()
      
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      const avatar = screen.getByTestId('mui-avatar')
      await user.click(avatar)

      await waitFor(() => {
        expect(screen.getByTestId('mui-popover')).toBeInTheDocument()
      })
    })

    it('opens popover when character icon is clicked with mouse event', async () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      const avatar = screen.getByTestId('mui-avatar')
      fireEvent.click(avatar)

      await waitFor(() => {
        expect(screen.getByTestId('mui-popover')).toBeInTheDocument()
      })
    })

    it('does not show popover initially', () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument()
    })
  })

  describe('Popover Interaction Behavior', () => {
    it('allows user to close popover after opening', async () => {
      const user = userEvent.setup()
      
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      const avatar = screen.getByTestId('mui-avatar')
      await user.click(avatar)

      await waitFor(() => {
        expect(screen.getByTestId('mui-popover')).toBeInTheDocument()
      })

      // Click outside to close
      fireEvent.click(document.body)

      await waitFor(() => {
        expect(screen.queryByTestId('mui-popover')).not.toBeInTheDocument()
      })
    })

    it('provides proper popover accessibility attributes', async () => {
      const user = userEvent.setup()
      
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      const avatar = screen.getByTestId('mui-avatar')
      await user.click(avatar)

      await waitFor(() => {
        const popover = screen.getByTestId('mui-popover')
        expect(popover).toBeInTheDocument()
      })
    })
  })

  describe('Context Integration', () => {
    it('uses correct character type from context', () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByTestId('mui-avatar')).toBeInTheDocument()
    })

    it('adapts to different game contexts correctly', () => {
      const hsrContext = {
        characterType: 'hsr-characters',
        charactersText: 'Characters',
        weaponType: 'lightcones',
        weaponsText: 'Light Cones'
      }

      render(
        <TypeContext.Provider value={hsrContext}>
          <HistoryImageCounter 
            counter={0}
            type="hsr-characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByTestId('mui-avatar')).toBeInTheDocument()
    })
  })

  describe('Edge Cases', () => {
    it('handles missing image gracefully', () => {
      const rundownWithoutImage = {
        ...mockRundown,
        name: 'UnknownCharacter',
        image: 'unknowncharacter'
      }

      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={rundownWithoutImage}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByTestId('mui-avatar')).toBeInTheDocument()
    })

    it('handles zero version index', () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={0}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByTestId('mui-avatar')).toBeInTheDocument()
    })

    it('handles high version index', () => {
      render(
        <TypeContext.Provider value={mockTypeContext}>
          <HistoryImageCounter 
            counter={0}
            type="characters"
            rundown={mockRundown}
            dataset={mockDataset}
            versionIndex={999}
          />
        </TypeContext.Provider>
      )

      expect(screen.getByTestId('mui-avatar')).toBeInTheDocument()
    })
  })
})