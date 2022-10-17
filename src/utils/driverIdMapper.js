import * as d3 from 'd3'

// Utils
import getDataFilePath from './getDataFilePath'

let driverIdMap = {}

d3.csv(getDataFilePath('drivers.csv')).then(d => {
  for (const driver of d) {
    driverIdMap[parseInt(driver.driverId)] = {
      name: `${driver.forename} ${driver.surname}`,
      nationality: driver.nationality
    }
  }
})

export default driverIdMap
