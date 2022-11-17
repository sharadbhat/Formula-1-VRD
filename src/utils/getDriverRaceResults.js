import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

let results = []

const getDriverRaceResults = async (raceId) => {
    if (results.length === 0) {
        const data = await d3.csv(getDataFilePath('results.csv'))
        results = data
    }

    return results.filter(
        row => raceId === +row.raceId
    ).map(row => ({
        driverId: +row.driverId,
        grid: +row.grid,
        position: +row.position,
        positionText: row.positionText
    })).sort((a, b) => +a.position - +b.position)
}

export default getDriverRaceResults