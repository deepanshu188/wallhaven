import { create } from 'zustand'

const initialFilterState = {
  q: '',
  sorting: '',
  order: '',
  ratio: '',
  categories: '',
  purity: '100',
}

type Filters = {
  filters: Record<string, string>
  showFilters: boolean
  setFilter: (key: string, value: string) => void
  setShowFilters: (show: boolean) => void
  resetFilters: () => void
}

export const useFilters = create<Filters>()((set) => ({
  filters: initialFilterState,
  showFilters: false,
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  setShowFilters: (show) => set({ showFilters: show }),
  resetFilters: () => set({ filters: initialFilterState }),
}))
