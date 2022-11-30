import { HoverCard, Table, Text } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'
import useGlobalStore from '../../utils/store'
import resultMapper from '../../utils/resultMapper'

// Icons
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons'

const RacePositionListViz = ({ driverFinishPositions, driverPositionsByLap, yScale, colorScale }) => {
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)
    const setSelectedDrivers = useGlobalStore(state => state.setSelectedDrivers)
    const hoveredDriverId = useGlobalStore((state) => state.hoveredDriverId)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const hoveredLap = useGlobalStore((state) => state.hoveredLap)

    const svgWidth = 225
    const svgHeight = 500

    const selectedDriversSet = new Set(selectedDrivers)

    const ref = useD3(svg => {
        let data = []
        if (!hoveredLap) {
            data = driverFinishPositions
        } else {
            data = driverPositionsByLap.get(hoveredLap)
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
                        .attr('x', 45)
                        .attr('y', d => yScale(hoveredLap ? +d.position : +d.positionOrder) + 10)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .text(d => `${+d.position ? 'P' + +d.position : resultMapper[d.positionText]?.shortText}`)
                },
                update => {
                    return update
                        .attr('driverId', d => +d.driverId)
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('cursor', 'pointer')
                        .attr('text-anchor', 'end')
                        .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d.driverId) ? 1 : 0.2) : 1)
                        .text(d => `${+d.position ? 'P' + +d.position : resultMapper[d.positionText]?.shortText}`)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .transition()
                        .duration(100)
                        .attr('y', d => yScale(hoveredLap ? +d.position : +d.positionOrder) + 10)
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
                        .attr('x', 55)
                        .attr('y', d => yScale(hoveredLap ? +d.position : +d.positionOrder) + 10)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .text(d => driverIdMapper[+d.driverId].name)
                },
                update => {
                    return update
                        .attr('driverId', d => +d.driverId)
                        .attr('fill', d => colorScale(+d.driverId))
                        .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d.driverId) ? 1 : 0.2) : 1)
                        .text(d => driverIdMapper[+d.driverId].name)
                        .attr('font-weight', d => hoveredDriverId === +d.driverId ? 700 : 500)
                        .transition()
                        .duration(100)
                        .attr('y', d => yScale(hoveredLap ? +d.position : +d.positionOrder) + 10)
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

    }, [hoveredLap, yScale.domain(), colorScale.domain(), selectedDrivers])

    return (
        <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', height: 30 }}>
                <Text style={{ fontWeight: 700 }}>{hoveredLap ? `Lap ${hoveredLap}` : 'Final Results'}</Text>
                <HoverCard width={280}>
                    <HoverCard.Target>
                        <FontAwesomeIcon color='white' style={{ paddingTop: 5 }} icon={faQuestionCircle} size='sm' />
                    </HoverCard.Target>
                    <HoverCard.Dropdown>
                        <Text size='sm'>
                            This visualization shows the names of which drivers changed positions as the race progressed.
                        </Text>
                        <Table>
                            <thead>
                                <tr>
                                    <th>Abbreviation</th>
                                    <th>Explanation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>DNF</td>
                                    <td>Did Not Finish</td>
                                </tr>
                                <tr>
                                    <td>DSQ</td>
                                    <td>Disqualified</td>
                                </tr>
                                <tr>
                                    <td>DNS</td>
                                    <td>Did Not Start</td>
                                </tr>
                                <tr>
                                    <td>Exc</td>
                                    <td>Excluded</td>
                                </tr>
                                <tr>
                                    <td>NC</td>
                                    <td>Not Classified</td>
                                </tr>
                            </tbody>
                        </Table>
                    </HoverCard.Dropdown>
                </HoverCard>
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