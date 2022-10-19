import * as d3 from 'd3'

// Utils
import getDataFilePath from './getDataFilePath'

export default async (raceId) => {
  let data = await d3.csv(getDataFilePath('lap_times.csv'))
  return data.filter(row => (
    +row.raceId === raceId
  )).map(row => ({
    driverId: +row.driverId,
    lap: +row.lap,
    position: +row.position
  }))
}
