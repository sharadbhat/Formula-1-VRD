import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

const driverIdMap = {}

d3.csv(getDataFilePath('drivers.csv')).then(d => {
  for (const driver of d) {
    driverIdMap[parseInt(driver.driverId)] = {
      name: `${driver.forename} ${driver.surname}`,
      number: +driver.number || 'N/A',
      code: driver.code === '\\N' ? 'N/A' : driver.code,
      nationality: driver.nationality,
      dob: new Date(driver.dob).toLocaleDateString('en-us', { year:'numeric', month:'long'}),
      url: driver.url
    }
  }
})

export default driverIdMap
