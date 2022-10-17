import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'
import * as d3 from 'd3'

// Components
import RacePositionViz from '../../components/RacePositionViz'

//Utils
import lapTimes from '../../utils/lapTimesReader'

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  let raceId = 1073

  useEffect(() => {
    async function fetchData() {
      setData(await lapTimes(raceId))
      setLoading(false)
    }
    fetchData();
  }, [raceId])

  return (
    <>
      <LoadingOverlay visible={loading} overlayBlur={2} />
      <RacePositionViz data={data} />
    </>
  )
}

export default Home