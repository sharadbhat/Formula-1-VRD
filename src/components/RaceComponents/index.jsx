import { Text } from '@mantine/core'

// Components
import OvertakeDensityViz from '../OvertakeDensityViz'
import RacePositionViz from '../RacePositionViz'
import DriverDetails from '../DriverDetails'

const RaceComponents = ({ racePositionData, driverFinishPositions, lapTimeData }) => {
    return (
        <>
            <RacePositionViz
                data={racePositionData}
                driverFinishPositions={driverFinishPositions}
                lapTimeData={lapTimeData}
            />
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <div>
                    <Text style={{ fontWeight: 700, marginLeft: 30, marginBottom: 10 }}>Positions Changed</Text>
                    <OvertakeDensityViz data={racePositionData} />
                </div>
                <div style={{ width: 750, marginRight: 10 }}>
                    <Text style={{ fontWeight: 700, marginBottom: 10 }}>Driver Profile(s)</Text>
                    <DriverDetails />
                </div>
            </div>
        </>
    )
}

export default RaceComponents