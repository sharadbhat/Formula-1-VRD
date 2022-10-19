import { useState, useEffect } from 'react'
import { LoadingOverlay } from '@mantine/core'

// Components
import RacePositionViz from '../../components/RacePositionViz'

//Utils
import { getRacePositions } from '../../utils/lapTimesFileReader'

const Home = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState([])

  let raceId = 1073

  useEffect(() => {
    async function fetchData() {
      setData(await getRacePositions(raceId))
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