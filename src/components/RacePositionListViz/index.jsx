import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'

const RacePositionListViz = ({ driverFinishPositions, driverPositionsByLap, yScale, colorScale, lap }) => {
    const svgWidth = 200
    const svgHeight = 500

    const ref = useD3(svg => {
        let data = []
        if (!lap) {
            data = driverFinishPositions
        } else {
            data = driverPositionsByLap.get(lap)
        }

        let finishCount = d3.max(data, d => +d.position)
        
        svg.select('#content')
            .selectAll('text')
            .data(data)
            .join(
                enter => {
                    return enter.append('text')
                        .attr('id', d => `driverId-${+d.driverId}`)
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('x', 10)
                        .attr('y', d => yScale(+d.position || ++finishCount) + 5)
                        .text(d => `${+d.position ? 'P' + +d.position : 'Ret'} ${driverIdMapper[+d.driverId].name}`)
                },
                update => {
                    return update
                        .attr('fill', d => colorScale(+d.driverId))
                        .text(d => `${+d.position ? 'P' + +d.position : 'Ret'} ${driverIdMapper[+d.driverId].name}`)
                        .transition()
                        .duration(100)
                        .attr('y', d => yScale(+d.position || ++finishCount) + 5)
                }),
            exit => {
                return exit.remove()
        }
    }, [lap, yScale, colorScale])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='content' />
        </svg>
    )
}

export default RacePositionListViz