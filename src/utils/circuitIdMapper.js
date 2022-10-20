import * as d3 from 'd3'

// Utils
import getDataFilePath from './getDataFilePath'

const circuitIdMap = {}

d3.csv(getDataFilePath('circuits.csv')).then(d => {
  for (const circuit of d) {
    circuitIdMap[parseInt(circuit.circuitId)] = {
      name: circuit.name,
      country: circuit.country,
      lat: parseFloat(circuit.lat),
      lng: parseFloat(circuit.lng),
      location: circuit.location
    }
  }
})

export default circuitIdMap
