import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import circuitIdMapper from '../../utils/circuitIdMapper'

const WorldMapViz = ({ season, raceList }) => {
  const svgWidth = 1000
  const svgHeight = 500

  const ref = useD3(svg => {

  }, [season])

  return (
    <svg height={svgHeight} width={svgWidth}>
      <g id='content' />
    </svg>
  )
}

export default WorldMapViz