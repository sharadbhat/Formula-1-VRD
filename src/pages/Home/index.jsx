import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

// Components
import OvertakeDensityViz from '../../components/OvertakeDensityViz'
import RacePositionViz from '../../components/RacePositionViz'
import WorldChampionshipViz from '../../components/WorldChampionshipViz'
import WorldChampionshipHeatmapViz from '../../components/WorldChampionshipHeatmapViz'
import LapTimeScatterPlotViz from '../../components/LapTimeScatterPlotViz'
import WorldMapViz from '../../components/WorldMapViz'
import RaceSelector from '../../components/RaceSelector'
import TrackDetails from '../../components/TrackDetails'
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
		  		<div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
					<RaceSelector />
					<WorldMapViz
						season={selectedSeason}
						raceList={raceList}
					/>
				</div>
				<TrackDetails />
				<RacePositionViz
					raceId={raceId}
					data={racePositionData}
					driverFinishPositions={driverFinishPositions}
				/>
				<DriverDetails />
				<LapTimeScatterPlotViz raceId={raceId} data={lapTimeData} />
				<OvertakeDensityViz raceId={raceId} data={racePositionData} />
				<WorldChampionshipViz season={selectedSeason} raceList={raceList} data={WCCData} isWCC />
				<WorldChampionshipViz season={selectedSeason} raceList={raceList} data={WDCData} />
				<WorldChampionshipHeatmapViz season={selectedSeason} raceList={raceList} data={WDCData} />
				<WorldChampionshipHeatmapViz season={selectedSeason} raceList={raceList} data={WCCData} isWCC />
		   	</>
		}
		</>
	)
}

export default Home