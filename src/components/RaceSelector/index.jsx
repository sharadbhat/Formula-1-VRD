import { useState, useEffect } from 'react'
import { Box, Button, Loader, ScrollArea, Stack } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'
import getRacesBySeason from '../../utils/getRacesBySeason'

const RaceSelector = () => {
    const selectedYear = useGlobalStore((state) => state.selectedYear)
    const selectedRaceId = useGlobalStore((state) => state.selectedRaceId)
    const setSelectedRaceId = useGlobalStore((state) => state.setSelectedRaceId)
    const setSelectedCircuitId = useGlobalStore((state) => state.setSelectedCircuitId)
    const setSelectedDrivers = useGlobalStore((state) => state.setSelectedDrivers)
    const setSelectedRound = useGlobalStore((state) => state.setSelectedRound)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const setHoveredLap = useGlobalStore((state) => state.setHoveredLap)
    const setHoveredRound = useGlobalStore((state) => state.setHoveredRound)
    const hoveredRound = useGlobalStore((state) => state.hoveredRound)

    const [raceList, setRaceList] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setRaceList([])
            setRaceList(await getRacesBySeason(selectedYear))
            setLoading(false)
		}
		fetchData()
	}, [selectedYear])

    const onChangeHandler = (raceId, round, circuitId) => {
        setSelectedRaceId(raceId)
        setSelectedRound(round)
        setSelectedCircuitId(circuitId)
        setSelectedDrivers([])
        setHoveredDriverId(null)
        setHoveredLap(null)
    }

    return (
        <>
            <Box
                sx={(theme) => ({
                    backgroundColor: theme.colors.dark[6],
                    borderRadius: theme.radius.md,
                    width: 400,
                    padding: 25
                })}
            >
                <ScrollArea style={{ width: 350, height: 475 }}>
                    {loading
                        ?   <div>
                                <Loader />
                            </div>
                        :   <Stack>
                                {raceList.map(race => {
                                    return (
                                        <Button
                                            key={race.raceId}
                                            variant={race.raceId === selectedRaceId ? 'filled' : (race.round === hoveredRound ? 'light' : 'outline')}
                                            onMouseEnter={() => setHoveredRound(race.round)}
                                            onMouseLeave={() => setHoveredRound(null)}
                                            onClick={() => onChangeHandler(race.raceId, race.round, race.circuitId)}
                                        >
                                            Round: {race.round} - {race.name}
                                        </Button>
                                    )
                                })}
                            </Stack>
                    }
                </ScrollArea>
            </Box>
        </>
    )
}

export default RaceSelector