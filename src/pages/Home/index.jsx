import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

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
      {loading
      ? <LoadingOverlay visible overlayBlur={2} />
      : <RacePositionViz data={data} />
      }
    </>
  )
}

export default Home