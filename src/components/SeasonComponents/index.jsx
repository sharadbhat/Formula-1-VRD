import { useState } from 'react'
import { SegmentedControl } from '@mantine/core'

// Components
import WorldChampionshipViz from '../WorldChampionshipViz'
import WorldChampionshipHeatmapViz from '../WorldChampionshipHeatmapViz'
import RaceSelector from '../RaceSelector'
import WorldMapViz from '../WorldMapViz'

// Utils
import useGlobalStore from '../../utils/store'

const SeasonComponents = ({ season, raceList, WCCData, WDCData }) => {
    const setSelectedParticipants = useGlobalStore(state => state.setSelectedParticipants)
    const setHoveredParticipant = useGlobalStore(state => state.setHoveredParticipant)
    const [value, setValue] = useState('wcc')

    const onChangeHandler = value => {
        setSelectedParticipants([])
        setHoveredParticipant(null)
        setValue(value)
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <SegmentedControl
                    value={value}
                    onChange={onChangeHandler}
                    data={[
                        { label: `World Constructors' Championship`, value: 'wcc' },
                        { label: `World Drivers' Championship`, value: 'wdc' },
                    ]}
                />
            </div>
            {value === 'wdc'
                ? <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <WorldChampionshipViz season={season} raceList={raceList} data={WDCData} />
                    <WorldChampionshipHeatmapViz season={season} raceList={raceList} data={WDCData} />
                </div>
                : <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                    <WorldChampionshipViz season={season} raceList={raceList} data={WCCData} isWCC />
                    <WorldChampionshipHeatmapViz season={season} raceList={raceList} data={WCCData} isWCC />
                </div>
            }
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <div>
                    <div style={{ height: 45 }}>
                        <b>Select a race</b>
                    </div>
                    <RaceSelector />
                </div>
                <div style={{ marginTop: 45 }}>
                    <WorldMapViz season={season} raceList={raceList} />
                </div>
            </div>
        </>
    )
}

export default SeasonComponents