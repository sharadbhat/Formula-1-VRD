import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'
import * as d3 from 'd3'

// Components
import RacePositionViz from '../../components/RacePositionViz'

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  let raceId = '1073'

  useEffect(() => {
    function fetchData() {
      d3.csv('data/lap_times.csv').then(d => {
        setData(d.filter(row => row.raceId === raceId).map(row => ({ driverId: +row.driverId, lap: +row.lap, position: +row.position })))
        setLoading(false)
      })
    }
    fetchData();
  },[raceId])

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <RacePositionViz data={data} />
    </>
  )
}

export default Home