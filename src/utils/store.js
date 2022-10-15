import create from 'zustand'

const useGlobalStore = create((set) => ({
  env: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod',
  selectedYear: null,
  setSelectedYear: (year) => set(() => ({ selectedYear: year }))
}))

export default useGlobalStore