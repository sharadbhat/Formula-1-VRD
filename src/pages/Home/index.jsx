import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

// Components
import SeasonComponents from '../../components/SeasonComponents'
import RaceComponents from '../../components/RaceComponents'
import DriverDetails from '../../components/DriverDetails'

// Utils
import useGlobalStore from '../../utils/store';
import { getLapTimes, getRacePositions } from '../../utils/lapTimesFileReader'
import getDriverRaceResults from '../../utils/getDriverRaceResults'
import getRacesBySeason from '../../utils/getRacesBySeason'
import getDriverStandings from '../../utils/getDriverStandings'
import getConstructorStandings from '../../utils/getConstructorStandings'

const Home = () => {
	const [loading, setLoading] = useState(true)
	const [racePositionData, setRacePositionData] = useState([])
	const [driverFinishPositions, setDriverFinishPositions] = useState([])
	const [lapTimeData, setLapTimeData] = useState([])
	const [WDCData, setWDCData] = useState([])
	const [WCCData, setWCCData] = useState([])
	const [raceList, setRaceList] = useState([])
	const [selectedSeason, setSelectedSeason] = useState(null)

	const raceId = useGlobalStore(state => state.selectedRaceId)
	const year = useGlobalStore(state => state.selectedYear)

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			setRacePositionData([])
			setDriverFinishPositions([])
			setLapTimeData([])
			setRacePositionData(await getRacePositions(raceId))
			setDriverFinishPositions(await getDriverRaceResults(raceId))
			setLapTimeData(await getLapTimes(raceId))
			setLoading(false)
		}
		fetchData()
	}, [raceId])

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			setWDCData([])
			setWCCData([])

			const races = await getRacesBySeason(year)
			setRaceList(races)
			setWDCData(await getDriverStandings(races.map(row => ({ raceId: +row.raceId, round: +row.round }))))
			setWCCData(await getConstructorStandings(races.map(row => ({ raceId: +row.raceId, round: +row.round }))))
			setLoading(false)
		}
		fetchData()
		setSelectedSeason(year)
	}, [year])

	return (
		<>
			{loading
				? <LoadingOverlay visible overlayBlur={2} />
				: <>
					{year
						? <>
							<SeasonComponents
								season={selectedSeason}
								raceList={raceList}
								WCCData={WCCData}
								WDCData={WDCData}
							/>
							{raceId
								? <div style={{ marginTop: 20 }}>
									<RaceComponents
										racePositionData={racePositionData}
										driverFinishPositions={driverFinishPositions}
										lapTimeData={lapTimeData}
									/>
									<DriverDetails />
								</div>
								: null
							}
						</>
						: null
					}
				</>
			}
		</>
	)
}

export default Home