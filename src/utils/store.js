import create from 'zustand'
import { devtools } from 'zustand/middleware'

const globalStore = (set) => ({
  env: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod',
  selectedYear: null,
  setSelectedYear: (year) => set(() => ({ selectedYear: year })),
  selectedDrivers: [],
  setSelectedDrivers: (driverSet) => set(() => ({ selectedDrivers: Array.from(driverSet) }))
})

const useGlobalStore = create(
  devtools(globalStore)
)

export default useGlobalStore