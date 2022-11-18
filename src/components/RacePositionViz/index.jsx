import { useState, useEffect } from 'react'
import * as d3 from 'd3'

// Components
import RacePositionListViz from '../RacePositionListViz'

// Utils
import { useD3 } from '../../utils/useD3'
import useGlobalStore from '../../utils/store'
import driverIdMapper from '../../utils/driverIdMapper'
import constants from '../../utils/constants'

const RacePositionViz = ({ data, raceId, driverFinishPositions, driverPositionsByLap }) => {
    const setSelectedDrivers = useGlobalStore((state) => state.setSelectedDrivers)

    const selectedDrivers = new Set()
    const selectedPaths = new Set()
    const [driverName, setDriverName] = useState(null)
    const [currentLap, setCurrentLap] = useState(null)
    const [currentPosition, setCurrentPosition] = useState(null)

    const [lap, setLap] = useState(null)

    const svgWidth = 1000
    const svgHeight = 500

    const cardHeight = 100
    const cardWidth = 200
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const margin = 30

    const [yScaleRef, setYScaleRef] = useState(null)
    const [colorScaleRef, setColorScaleRef] = useState(null)

    const ref = useD3(svg => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, svgWidth - margin])

        const positionsList = []
        for (let i = 1; i <= d3.max(data.map(d => +d.position)); i++) {
            positionsList.push(i)
        }

        let yScale = d3.scalePoint()
            .domain(positionsList)
            .range([0, svgHeight - margin])

        setYScaleRef(() => yScale)

        svg.select('#xAxis')
            .attr('transform', `translate(${margin}, ${svgHeight - margin})`)
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
            .attr('stroke-width', 5)
            .attr('d', d => {
                return d3.line()
                    .x(d => margin + xScale(+d.lap))
                    .y(d => yScale(+d.position))
                    .curve(d3.curveMonotoneX)
                    (d[1])
            })
            .on('mouseenter', e => {
                // Thicker line
                svg.select(`#${e.target.id}`)
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 10)

                let [xPosition, yPosition] = d3.pointer(e)

                const currentDriverId = +e.target.getAttribute('driverId')
                const closestLap = Math.round(xScale.invert(xPosition - margin))
                const index = bisect(groupedData.get(currentDriverId), closestLap)
                const datapoint = groupedData.get(currentDriverId)[index]

                setCurrentLap(datapoint['lap'])
                setCurrentPosition(datapoint['position'])
                setDriverName(driverIdMapper[e.target.getAttribute('driverId')].name)

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
                const closestLap = Math.round(xScale.invert(xPosition - margin))
                const index = bisect(groupedData.get(currentDriverId), closestLap)
                const datapoint = groupedData.get(currentDriverId)[index]

                setCurrentLap(datapoint['lap'])
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
            .on('mouseleave', e => {
                // Reset line thickness
                svg.select(`#${e.target.id}`)
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 5)

                // Hide card group
                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })
            .on('click', e => {
                if (selectedPaths.has(e.target.id)) {
                    selectedDrivers.delete(+e.target.getAttribute('driverId'))
                    selectedPaths.delete(e.target.id)
                    svg.select(`#${e.target.id}`)
                        .attr('opacity', 0.2)

                    // If no line selected, reset opacity of all lines
                    if (selectedPaths.size === 0) {
                        svg.select('#content')
                            .selectAll('path')
                            .attr('opacity', 1)
                    }
                } else {
                    selectedDrivers.add(+e.target.getAttribute('driverId'))
                    selectedPaths.add(e.target.id)
                    if (selectedPaths.size === 1) {
                        // Reduce opacity of all lines
                        svg.select('#content')
                            .selectAll('path')
                            .attr('opacity', 0.2)
                    }

                    // Reset opacity of selected line
                    svg.select(`#${e.target.id}`)
                        .attr('opacity', 1)
                }
                setSelectedDrivers(selectedDrivers)
            })

        svg.on('mouseenter', e => {
            let [xPosition] = d3.pointer(e)

            let closestLap = Math.round(xScale.invert(xPosition - margin)) || 1

            xPosition = xScale(closestLap) + margin

            svg.select('#hoverLine')
                .attr('x1', xPosition)
                .attr('x2', xPosition)
                .attr('visibility', 'visible')

            setLap(closestLap)
        }).on('mousemove', e => {
            let [xPosition] = d3.pointer(e)

            let closestLap = Math.round(xScale.invert(xPosition - margin)) || 1

            xPosition = xScale(closestLap) + margin

            svg.select('#hoverLine')
                .attr('x1', xPosition)
                .attr('x2', xPosition)

            setLap(closestLap)
        }).on('mouseleave', () => {
            svg.select('#hoverLine')
                .attr('visibility', 'hidden')

            setLap(null)
        })
    }, [data.length])

    return (
        <>
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
                            Lap: {currentLap}
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
            {(yScaleRef && colorScaleRef)
                ? <RacePositionListViz
                        lap={lap}
                        driverFinishPositions={driverFinishPositions}
                        driverPositionsByLap={driverPositionsByLap}
                        yScale={yScaleRef}
                        colorScale={colorScaleRef}
                    />
                : null
            }
        </>
    )
}

export default RacePositionViz