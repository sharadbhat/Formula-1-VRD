import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

let races = []

const getRacesBySeason = async (year) => {
    if (races.length === 0) {
        const data = await d3.csv(getDataFilePath('races.csv'))
        races = data
    }

    return races.filter(row => (
        +row.year === +year
    )).map(row => ({
        raceId: +row.raceId,
        year: +row.year,
        round: +row.round,
        circuitId: +row.circuitId,
        name: row.name
    })).sort((a ,b) => a.round - b.round)
}

export default getRacesBySeason