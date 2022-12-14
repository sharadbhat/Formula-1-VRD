import { forwardRef } from 'react'
import { Select, Text } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'

// CSS
import './styles.css'

const SelectItem = forwardRef(
    ({ label, ...others }, ref) => (
      <div ref={ref} {...others}>
        <div className='text-container'>
            <Text weight={700}>{others.value}</Text><Text>&nbsp;Formula 1 Season</Text>
        </div>
      </div>
    )
  )

const SeasonSelector = () => {
    const selectedYear = useGlobalStore((state) => state.selectedYear)
    const setSelectedYear = useGlobalStore((state) => state.setSelectedYear)
    const setSelectedRaceId = useGlobalStore((state) => state.setSelectedRaceId)
    const setSelectedCircuitId = useGlobalStore((state) => state.setSelectedCircuitId)
    const setSelectedDrivers = useGlobalStore((state) => state.setSelectedDrivers)
    const setSelectedRound = useGlobalStore((state) => state.setSelectedRound)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const setHoveredLap = useGlobalStore((state) => state.setHoveredLap)
    const setHoveredRound = useGlobalStore((state) => state.setHoveredRound)
    const setSelectedParticipants = useGlobalStore((state) => state.setSelectedParticipants)
    const setHoveredParticipant = useGlobalStore((state) => state.setHoveredParticipant)

    const data = []
    for (let i = 2021; i >= 1996; i--) {
        data.push({
            value: i,
            label: `${i} Formula 1 Season`
        })
    }

    const onChangeHandler = year => {
        setSelectedYear(year)
        setSelectedRaceId(null)
        setSelectedCircuitId(null)
        setSelectedDrivers([])
        setSelectedRound(null)
        setHoveredDriverId(null)
        setHoveredLap(null)
        setHoveredRound(null)
        setSelectedParticipants([])
        setHoveredParticipant(null)
    }

    return (
        <Select
            placeholder='Select a season'
            value={selectedYear}
            data={data}
            itemComponent={SelectItem}
            transition='pop-top-left'
            transitionDuration={80}
            transitionTimingFunction='ease'
            onChange={onChangeHandler}
        />
    )
}

export default SeasonSelector