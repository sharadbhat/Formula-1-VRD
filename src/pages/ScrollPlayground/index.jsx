import { useEffect, useState } from 'react';
import { Scrollama, Step } from 'react-scrollama'

import RacePositionViz from '../../components/RacePositionViz'
import { getRacePositions } from '../../utils/lapTimesFileReader'

const ScrollPlayground = () => {
    let timer = null
    const onStepEnter = (data) => {
        clearTimeout(timer)
        setData(tempData)
    }

    const onStepExit = (data) => {
        if (data.direction === 'up') {
            timer = setTimeout(() => {
                setData([])
            }, 2000);
        }
    }

	const [data, setData] = useState([])
    const [tempData, setTempData] = useState([])
    let raceId = 1073
    useEffect(() => {
		async function fetchData() {
            setData([])
            setTempData(await getRacePositions(raceId))
		}
		fetchData()
	}, [raceId])

    return (
    <div>
        <div style={{ height: '100vh' }} />
        <Scrollama offset={0.5} onStepEnter={onStepEnter} onStepExit={onStepExit} debug>
            <Step data={23}>
                <div>
                    <RacePositionViz data={data} />
                </div>
            </Step>
        </Scrollama>
        <div style={{ height: '100vh' }} />
    </div>
    );    
}

export default ScrollPlayground