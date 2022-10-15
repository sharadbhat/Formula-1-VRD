import create from 'zustand'

const useGlobalStore = create((set) => ({
  selectedYear: null,
  setSelectedYear: (year) => set(() => ({ selectedYear: year }))
}))

export default useGlobalStore