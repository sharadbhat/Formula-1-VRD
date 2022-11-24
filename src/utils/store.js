import create from 'zustand'
import { devtools } from 'zustand/middleware'

const globalStore = (set) => ({
  env: (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? 'dev' : 'prod',
  selectedYear: null,
  setSelectedYear: (year) => set(() => ({ selectedYear: year })),
  selectedRaceId: null,
  setSelectedRaceId: (raceId) => set(() => ({ selectedRaceId: raceId })),
  selectedDrivers: [],
  setSelectedDrivers: (driverSet) => set(() => ({ selectedDrivers: Array.from(driverSet) })),
  selectedRound: null,
  setSelectedRound: (round) => set(() => ({ selectedRound: round })),
  hoveredDriverId: null,
  setHoveredDriverId: (driverId) => set(() => ({ hoveredDriverId: driverId })),
  hoveredLap: null,
  setHoveredLap: (lap) => set(() => ({ hoveredLap: lap })),
  hoveredRound: null,
  setHoveredRound: (round) => set(() => ({ hoveredRound: round })),
  hoveredParticipant: null,
  setHoveredParticipant: (participant) => set(() => ({ hoveredParticipant: participant })),
  selectedParticipants: [],
  setSelectedParticipants: (participantSet) => set(() => ({ selectedParticipants: Array.from(participantSet) }))
})

const useGlobalStore = create(
  devtools(globalStore)
)

export default useGlobalStore