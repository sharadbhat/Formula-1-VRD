import { useState, useEffect } from 'react'
import * as d3 from 'd3'

// Components
import RacePositionListViz from '../RacePositionListViz'

// Utils
import { useD3 } from '../../utils/useD3'
import useGlobalStore from '../../utils/store'
import driverIdMapper from '../../utils/driverIdMapper'
import constants from '../../utils/constants'

const RacePositionViz = ({ data, raceId, driverFinishPositions }) => {
    const selectedDrivers = useGlobalStore((state) => state.selectedDrivers)
    const setSelectedDrivers = useGlobalStore((state) => state.setSelectedDrivers)
    const hoveredDriverId = useGlobalStore((state) => state.hoveredDriverId)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const hoveredLap = useGlobalStore((state) => state.hoveredLap)
    const setHoveredLap = useGlobalStore((state) => state.setHoveredLap)

    const selectedDriversSet = new Set(selectedDrivers)
    const [driverName, setDriverName] = useState(null)
    const [currentPosition, setCurrentPosition] = useState(null)

    const svgWidth = 1000
    const svgHeight = 500

    const cardHeight = 100
    const cardWidth = 200
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const margin = 30
    const padding = 15

    const [yScaleRef, setYScaleRef] = useState(null)
    const [colorScaleRef, setColorScaleRef] = useState(null)

    const ref = useD3(svg => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([padding, svgWidth - margin])

        const positionsList = []
        for (let i = 1; i <= d3.max(driverFinishPositions.map(d => +d.positionOrder)); i++) {
            positionsList.push(i)
        }

        let yScale = d3.scalePoint()
            .domain(positionsList)
            .range([padding, svgHeight - margin])

        setYScaleRef(() => yScale)

        svg.select('#xAxis')
            .attr('transform', `translate(${margin - padding}, ${svgHeight - margin})`)
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScale))

        svg.select('#yAxis')
            .attr('transform', `translate(${margin}, 0)`)
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .call(d3.axisLeft(yScale))

        const groupedData = d3.group(data, d => +d.driverId)

        const colorScale = d3.scaleOrdinal()
            .domain(Array.from(groupedData.keys()))
            .range(constants.categoricalColors)

        setColorScaleRef(() => colorScale)

        const bisect = d3.bisector(d => +d.lap).left;

        svg.select('#content')
            .selectAll('path')
            .data(groupedData)
            .join('path')
            .attr('id', d => `racePositionVizDriverId-${d[0]}`)
            .attr('driverId', d => +d[0])
            .attr('fill', 'none')
            .attr('stroke', d => colorScale(+d[0]))
            .attr('opacity', d => selectedDriversSet.size > 0 ? (selectedDriversSet.has(+d[0]) ? 1 : 0.2) : 1)
            .attr('d', d => {
                return d3.line()
                    .x(d => margin + xScale(+d.lap) - padding)
                    .y(d => yScale(+d.position))
                    .curve(d3.curveMonotoneX)
                    (d[1])
            })
            .on('mouseenter', e => {
                let [xPosition, yPosition] = d3.pointer(e)

                const currentDriverId = +e.target.getAttribute('driverId')
                const closestLap = Math.round(xScale.invert(xPosition - margin + padding))
                const index = bisect(groupedData.get(currentDriverId), closestLap)
                const datapoint = groupedData.get(currentDriverId)[index]

                setCurrentPosition(datapoint['position'])
                setDriverName(driverIdMapper[e.target.getAttribute('driverId')].name)
                setHoveredDriverId(currentDriverId)

                if (xPosition > svgWidth / 2) {
                    xPosition -= (cardWidth + 10)
                } else {
                    xPosition += 10
                }
                if (yPosition > svgHeight / 2) {
                    yPosition -= (cardHeight + 10)
                } else {
                    yPosition += 10
                }

                // Show and move card
                svg.select('#hover-card-group')
                    .attr('visibility', 'visible')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)
            })
            .on('mousemove', e => {
                let [xPosition, yPosition] = d3.pointer(e)

                const currentDriverId = +e.target.getAttribute('driverId')
                const closestLap = Math.round(xScale.invert(xPosition - margin + padding))
                const index = bisect(groupedData.get(currentDriverId), closestLap)
                const datapoint = groupedData.get(currentDriverId)[index]

                setCurrentPosition(datapoint['position'])

                if (xPosition > svgWidth / 2) {
                    xPosition -= (cardWidth + 10)
                } else {
                    xPosition += 10
                }
                if (yPosition > svgHeight / 2) {
                    yPosition -= (cardHeight + 10)
                } else {
                    yPosition += 10
                }
                svg.select('#hover-card-group')
                    .attr('transform', `translate(${xPosition}, ${yPosition})`)
            })
            .on('mouseleave', () => {
                setHoveredDriverId(null)

                // Hide card group
                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })
            .on('click', e => {
                let driverId = +e.target.getAttribute('driverId')

                if (selectedDriversSet.has(driverId)) {
                    selectedDriversSet.delete(driverId)
                } else {
                    selectedDriversSet.add(driverId)
                }

                setSelectedDrivers(selectedDriversSet)
            })
            .transition()
            .duration(100)
            .attr('stroke-width', d => hoveredDriverId === +d[0] ? 10 : 5)

        svg.on('mouseenter', e => {
            let [xPosition] = d3.pointer(e)

            let [xScaleStart, xScaleEnd] = xScale.domain()

            let closestLap = Math.round(xScale.invert(xPosition - margin + padding))

            if (closestLap > xScaleEnd) {
                closestLap = null
            } else if (closestLap < xScaleStart) {
                closestLap = null
            }

            setHoveredLap(closestLap)
        }).on('mousemove', e => {
            let [xPosition] = d3.pointer(e)

            let [xScaleStart, xScaleEnd] = xScale.domain()

            let closestLap = Math.round(xScale.invert(xPosition - margin + padding))

            if (closestLap > xScaleEnd) {
                closestLap = null
            } else if (closestLap < xScaleStart) {
                closestLap = null
            }

            setHoveredLap(closestLap)
        }).on('mouseleave', () => {
            setHoveredLap(null)
        })

        let hoverLinePosition = xScale(hoveredLap) + margin - padding

        svg.select('#hoverLine')
            .attr('visibility', hoveredLap ? 'visible' : 'hidden')
            .attr('x1', hoverLinePosition)
            .attr('x2', hoverLinePosition)
    }, [data.length, driverFinishPositions.length, selectedDrivers, hoveredDriverId, hoveredLap])

    return (
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <div style={{ marginTop: 30 }}>
                <svg ref={ref} style={{ width: svgWidth, height: svgHeight }}>
                    <g id='xAxis' />
                    <g id='yAxis' />
                    <line
                        id='hoverLine'
                        x1={0}
                        x2={0}
                        y1={0}
                        y2={svgHeight - margin}
                        stroke={'gray'}
                        strokeWidth={5}
                        opacity={0.75}
                        visibility={'hidden'}
                    />
                    <g id='content' />
                    <g id='hover-card-group' visibility={'hidden'}>
                        <rect
                            id='hover-card'
                            fill={cardColor}
                            height={cardHeight}
                            width={cardWidth}
                            rx={cardCornerRadius}
                            ry={cardCornerRadius}
                        />
                        <g id='hover-card-content-group'>
                            <text
                                id='hover-card-driver-name'
                                textAnchor='middle'
                                fill='white'
                                x={cardWidth / 2}
                                y={cardHeight / 4 + 5}
                                fontWeight={700}
                            >
                                {driverName}
                            </text>
                            <text
                                id='hover-card-current-lap'
                                textAnchor='middle'
                                fill='white'
                                x={cardWidth / 2}
                                y={cardHeight / 2 + 5}
                            >
                                Lap: {hoveredLap}
                            </text>
                            <text
                                id='hover-card-current-position'
                                textAnchor='middle'
                                fill='white'
                                x={cardWidth / 2}
                                y={3 * cardHeight / 4 + 5}
                            >
                                Position: {currentPosition}
                            </text>
                        </g>
                    </g>
                </svg>
            </div>
            {(yScaleRef && yScaleRef.domain().length && colorScaleRef && colorScaleRef.domain().length && driverFinishPositions.length)
                ?   <RacePositionListViz
                        driverFinishPositions={driverFinishPositions}
                        driverPositionsByLap={d3.group(data, d => +d.lap)}
                        yScale={yScaleRef}
                        colorScale={colorScaleRef}
                    />
                :   null
            }
        </div>
    )
}

export default RacePositionViz