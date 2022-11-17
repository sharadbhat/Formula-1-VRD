import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'

const RacePositionListViz = ({ data, yScale, colorScale, lap }) => {
    const svgWidth = 200
    const svgHeight = 500

    let finishCount = d3.max(data, d => +d.position)

    const ref = useD3(svg => {
        if (yScale && colorScale) {
            svg.select('#content')
                .selectAll('text')
                .data(data)
                .join('text')
                .attr('x', 10)
                .attr('y', d => yScale(+d.position || ++finishCount) + 5)
                .attr('fill', d => colorScale(+d.driverId))
                .text(d => `${+d.position ? 'P' + +d.position : 'Ret'} ${driverIdMapper[+d.driverId].name}`)
        }
    }, [lap, yScale, colorScale])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='content' />
        </svg>
    )
}

export default RacePositionListViz