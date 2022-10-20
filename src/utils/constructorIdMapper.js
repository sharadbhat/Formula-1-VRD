import * as d3 from 'd3'

// Utils
import getDataFilePath from './getDataFilePath'

const constructorIdMap = {}

d3.csv(getDataFilePath('constructors.csv')).then(d => {
  for (const constructor of d) {
    constructorIdMap[parseInt(constructor.constructorId)] = {
      name: constructor.name,
      nationality: constructor.nationality
    }
  }
})

export default constructorIdMap
