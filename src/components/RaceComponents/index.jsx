// Components
import OvertakeDensityViz from '../OvertakeDensityViz'
import RacePositionViz from '../RacePositionViz'

const RaceComponents = ({ racePositionData, driverFinishPositions, lapTimeData }) => {
    return (
        <>
            <RacePositionViz
                data={racePositionData}
                driverFinishPositions={driverFinishPositions}
                lapTimeData={lapTimeData}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: 30, paddingLeft: 30 }}>
                    <b>Positions Changes</b>
                </div>
                <OvertakeDensityViz data={racePositionData} />
            </div>
        </>
    )
}

export default RaceComponents