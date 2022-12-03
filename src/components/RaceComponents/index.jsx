import { HoverCard, Text } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Components
import OvertakeDensityViz from '../OvertakeDensityViz'
import RacePositionViz from '../RacePositionViz'
import DriverDetails from '../DriverDetails'

// Utils
import useGlobalStore from '../../utils/store'

// Icons
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'
import { faCircleChevronRight } from '@fortawesome/free-solid-svg-icons'

const RaceComponents = ({ racePositionData, driverFinishPositions, lapTimeData }) => {
    const width = window.innerWidth
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)
    return (
        <>
            <RacePositionViz
                data={racePositionData}
                driverFinishPositions={driverFinishPositions}
                lapTimeData={lapTimeData}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginLeft: 30 }}>
                        <Text style={{ fontWeight: 700, marginRight: 20 }}>Positions Changed</Text>
                        <HoverCard width={280}>
                            <HoverCard.Target>
                                <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                            </HoverCard.Target>
                            <HoverCard.Dropdown>
                                <Text size='sm'>
                                    This visualization shows where the majority of the position changes happened in the race.
                                </Text>
                            </HoverCard.Dropdown>
                        </HoverCard>
                    </div>
                    <OvertakeDensityViz data={racePositionData} />
                </div>
                <div style={{ width: 0.49 * width, marginRight: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontWeight: 700, marginRight: 20 }}>Driver Profile(s)</Text>
                            <HoverCard width={280}>
                                <HoverCard.Target>
                                    <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size='sm'>
                                        This sections shows a card for each selected driver.
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                        </div>
                        {selectedDrivers.length > 2
                            ? <HoverCard>
                                <HoverCard.Target>
                                    <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faCircleChevronRight} size='sm' />
                                </HoverCard.Target>
                                <HoverCard.Dropdown>
                                    <Text size='sm'>
                                        Scroll to the right to view all driver cards
                                    </Text>
                                </HoverCard.Dropdown>
                            </HoverCard>
                            : null}
                    </div>
                    <DriverDetails />
                </div>
            </div>
        </>
    )
}

export default RaceComponents