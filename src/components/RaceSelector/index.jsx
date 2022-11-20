import { useState, useEffect } from 'react'
import { Select } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'
import getRacesBySeason from '../../utils/getRacesBySeason'

const RaceSelector = () => {
    const selectedYear = useGlobalStore((state) => state.selectedYear)
    const selectedRaceId = useGlobalStore((state) => state.selectedRaceId)
    const setSelectedRaceId = useGlobalStore((state) => state.setSelectedRaceId)
    const setSelectedDrivers = useGlobalStore((state) => state.setSelectedDrivers)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const setHoveredLap = useGlobalStore((state) => state.setHoveredLap)

    const [selectDataOptions, setSelectDataOptions] = useState([])

    useEffect(() => {
        async function fetchData() {
            const raceList = await getRacesBySeason(selectedYear)
            
            const data = []
            for (const race of raceList) {
                data.push({
                    value: race.raceId,
                    label: race.name
                })
            }
            setSelectDataOptions(data)
		}
		fetchData()
	}, [selectedYear])

    const onChangeHandler = raceId => {
        setSelectedRaceId(raceId)
        setSelectedDrivers([])
        setHoveredDriverId(null)
        setHoveredLap(null)
    }

    return (
        <div style={{ width: 200 }}>
            <Select
                value={selectedRaceId}
                placeholder='Select a race'
                data={selectDataOptions}
                transition='pop-top-left'
                transitionDuration={80}
                transitionTimingFunction='ease'
                onChange={onChangeHandler}
            />
        </div>
    )
}

export default RaceSelector