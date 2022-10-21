import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

let lapTimes = []

export const getRacePositions = async (raceId) => {
  if (lapTimes.length === 0) {
    const data = await d3.csv(getDataFilePath('lap_times.csv'))
    lapTimes = data
  }

  return lapTimes.filter(row => (
    +row.raceId === +raceId
  )).map(row => ({
    driverId: +row.driverId,
    lap: +row.lap,
    position: +row.position
  }))
}

export const getLapTimes = async (raceId) => {
  if (lapTimes.length === 0) {
    const data = await d3.csv(getDataFilePath('lap_times.csv'))
    lapTimes = data
  }

  return lapTimes.filter(row => (
    +row.raceId === +raceId
  )).map(row => ({
    driverId: +row.driverId,
    lap: +row.lap,
    position: +row.position,
    time: row.time,
    milliseconds: +row.milliseconds
  }))
}