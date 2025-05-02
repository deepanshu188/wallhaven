import { create } from 'zustand'

const initialFilterState = {
  sorting: '',
  order: '',
  ratio: '',
  categories: '',
  purity: '100',
}

type Filters = {
  filters: Record<string, string>
  setFilter: (key: string, value: string) => void
  resetFilters: () => void
}

export const useFilters = create<Filters>()((set) => ({
  filters: initialFilterState,
  setFilter: (key, value) => set((state) => ({ filters: { ...state.filters, [key]: value } })),
  resetFilters: () => set({ filters: initialFilterState }),
}))
