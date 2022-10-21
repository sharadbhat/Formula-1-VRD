import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

let standings = []

const getDriverStandings = async (raceIdList) => {
    if (standings.length === 0) {
        const data = await d3.csv(getDataFilePath('driver_standings.csv'))
        standings = data
    }

    const raceIdSet = new Set(raceIdList.map(row => +row.raceId))
    const raceIdToRoundMap = {}
    for (const race of raceIdList) {
        raceIdToRoundMap[+race.raceId] = +race.round
    }

    return standings.filter(
        row => raceIdSet.has(+row.raceId)
    ).map(row => ({
        driverId: +row.driverId,
        raceId: +row.raceId,
        points: +row.points,
        round: +raceIdToRoundMap[+row.raceId]
    }))
    .sort((a, b) => a.round - b.round)
}

export default getDriverStandings