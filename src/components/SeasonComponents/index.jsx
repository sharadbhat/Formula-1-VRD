import { useState } from 'react'
import { HoverCard, SegmentedControl, Text } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Components
import WorldChampionshipViz from '../WorldChampionshipViz'
import WorldChampionshipHeatmapViz from '../WorldChampionshipHeatmapViz'
import RaceSelector from '../RaceSelector'
import WorldMapViz from '../WorldMapViz'
import TrackDetails from '../TrackDetails'

// Utils
import useGlobalStore from '../../utils/store'

// Icons
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

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
                ? <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 700, marginRight: 20 }}>World Championship</Text>
                            <HoverCard width={280}>
                                <HoverCard.Target>
                                    <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size='sm'>
                                        This visualization shows the points race between different drivers as the season progressed.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </div>
                        <WorldChampionshipViz season={season} raceList={raceList} data={WDCData} />
                    </div>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 700, marginRight: 20 }}>Points Heatmap</Text>
                            <HoverCard width={280}>
                                <HoverCard.Target>
                                    <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size='sm'>
                                        This visualization shows which drivers scored the majority of the points as the season progressed.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </div>
                        <WorldChampionshipHeatmapViz season={season} raceList={raceList} data={WDCData} />
                    </div>
                </div>
                : <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 }}>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 700, marginRight: 20 }}>World Championship</Text>
                            <HoverCard width={280}>
                                <HoverCard.Target>
                                    <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size='sm'>
                                        This visualization shows the points race between different teams as the season progressed.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </div>
                        <WorldChampionshipViz season={season} raceList={raceList} data={WCCData} isWCC />
                    </div>
                    <div>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 700, marginRight: 20 }}>Points Heatmap</Text>
                            <HoverCard width={280}>
                                <HoverCard.Target>
                                    <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size='sm'>
                                        This visualization shows which teams scored the majority of the points as the season progressed.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </div>
                        <WorldChampionshipHeatmapViz season={season} raceList={raceList} data={WCCData} isWCC />
                    </div>
                </div>
            }
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
                <div style={{ position: 'absolute', zIndex: 1, left: 430, bottom: 0 }}>
                    <TrackDetails />
                </div>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', height: 45 }}>
                        <Text style={{ fontWeight: 700, marginRight: 20 }}>Select a race</Text>
                        <HoverCard width={280}>
                            <HoverCard.Target>
                                <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size='sm'>
                                    Select a race from the menu or the world map to see race details.
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
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