import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

// Components
import WDCViz from '../../components/WDCViz'
import RacePositionViz from '../../components/RacePositionViz'
import WDCHeatmapViz from '../../components/WDCHeatmapViz'

//Utils
import useGlobalStore from '../../utils/store';
import { getRacePositions } from '../../utils/lapTimesFileReader'
import getRacesBySeason from '../../utils/getRacesBySeason'
import getDriverStandings from '../../utils/getDriverStandings'

const Home = () => {
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState([])
	const [WDCData, setWDCData] = useState([])
	const [raceList, setRaceList] = useState([])

	let raceId = 1073
	const year = useGlobalStore(state => state.selectedYear)

	useEffect(() => {
		async function fetchData() {
		setLoading(true)
		setData([])
		setData(await getRacePositions(raceId))
		setLoading(false)
		}
		fetchData()
	}, [raceId])

	useEffect(() => {
		async function fetchData() {
			setLoading(true)
			setWDCData([])
			const races = await getRacesBySeason(year)
			setRaceList(races)
			setWDCData(await getDriverStandings(races.map(row => ({raceId: +row.raceId, round: +row.round}))))
			setLoading(false)
		}
		fetchData()
	}, [year])

	return (
		<>
		{loading
		  ? <LoadingOverlay visible overlayBlur={2} />
		  : <>
				<RacePositionViz data={data} />
				<WDCViz raceList={raceList} data={WDCData} />
				<WDCHeatmapViz raceList={raceList} data={WDCData} />
		   	</>
		}
		</>
	)
}

export default Home