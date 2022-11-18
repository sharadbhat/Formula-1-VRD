import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'
import useGlobalStore from '../../utils/store'

const RacePositionListViz = ({ driverFinishPositions, driverPositionsByLap, yScale, colorScale, lap }) => {
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)
    const setSelectedDrivers = useGlobalStore(state => state.setSelectedDrivers)
    const hoveredDriverId = useGlobalStore((state) => state.hoveredDriverId)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)

    const svgWidth = 250
    const svgHeight = 500

    const selectedDriversSet = new Set(selectedDrivers)

    const ref = useD3(svg => {
        let data = []
        if (!lap) {
            data = driverFinishPositions
        } else {
            data = driverPositionsByLap.get(lap)
        }

        svg.select('#content')
            .select('#positions')
            .selectAll('text')
            .data(data)
            .join(
                enter => {
                    return enter.append('text')
                        .attr('driverId', d => +d.driverId)
                        .attr('text-anchor', 'end')
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('cursor', 'pointer')
                        .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d.driverId) ? 1 : 0.2) : 1)
                        .attr('x', 50)
                        .attr('y', d => yScale(lap ? +d.position : +d.positionOrder) + 5)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .text(d => `${+d.position ? 'P' + +d.position : 'Ret'}`)
                },
                update => {
                    return update
                        .attr('driverId', d => +d.driverId)
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('cursor', 'pointer')
                        .attr('text-anchor', 'end')
                        .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d.driverId) ? 1 : 0.2) : 1)
                        .text(d => `${+d.position ? 'P' + +d.position : 'Ret'}`)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .transition()
                        .duration(100)
                        .attr('y', d => yScale(lap ? +d.position : +d.positionOrder) + 5)
                },
                exit => {
                    return exit.remove()
                }
            ).on('click', e => {
                let driverId = +e.target.getAttribute('driverId')

                if (selectedDriversSet.has(driverId)) {
                    selectedDriversSet.delete(driverId)
                } else {
                    selectedDriversSet.add(driverId)
                }

                setSelectedDrivers(selectedDriversSet)
            })
            .on('mouseenter', e => {
                let driverId = +e.target.getAttribute('driverId')
                setHoveredDriverId(driverId)
            })
            .on('mouseleave', () => {
                setHoveredDriverId(null)
            })

            svg.select('#content')
            .select('#names')
            .selectAll('text')
            .data(data)
            .join(
                enter => {
                    return enter.append('text')
                        .attr('driverId', d => +d.driverId)
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('cursor', 'pointer')
                        .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d.driverId) ? 1 : 0.2) : 1)
                        .attr('x', 65)
                        .attr('y', d => yScale(lap ? +d.position : +d.positionOrder) + 5)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .text(d => driverIdMapper[+d.driverId].name)
                },
                update => {
                    return update
                        .attr('driverId', d => +d.driverId)
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('cursor', 'pointer')
                        .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d.driverId) ? 1 : 0.2) : 1)
                        .text(d => driverIdMapper[+d.driverId].name)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .transition()
                        .duration(100)
                        .attr('y', d => yScale(lap ? +d.position : +d.positionOrder) + 5)
                },
                exit => {
                    return exit.remove()
                }
            )
            .on('click', e => {
                let driverId = +e.target.getAttribute('driverId')

                if (selectedDriversSet.has(driverId)) {
                    selectedDriversSet.delete(driverId)
                } else {
                    selectedDriversSet.add(driverId)
                }

                setSelectedDrivers(selectedDriversSet)
            })
            .on('mouseenter', e => {
                let driverId = +e.target.getAttribute('driverId')
                setHoveredDriverId(driverId)
            })
            .on('mouseleave', () => {
                setHoveredDriverId(null)
            })

    }, [lap, yScale.domain(), colorScale.domain(), selectedDrivers])

    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <div style={{ height: 30 }}>
                <b>{lap ? `Lap ${lap}` : 'Final Results'}</b>
            </div>
            <svg ref={ref} height={svgHeight} width={svgWidth}>
                <rect fill='white' height={svgHeight} width={svgWidth} rx={5} opacity={0.05} />
                <g id='content'>
                    <g id='positions' />
                    <g id='names' />
                </g>
            </svg>
        </div>
    )
}

export default RacePositionListViz