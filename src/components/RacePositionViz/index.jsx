import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'
import constants from '../../utils/constants';

const RacePositionViz = ({ data }) => {
    const selectedPaths = new Set()
    const [driverName, setDriverName] = useState(null)
    const [currentLap, setCurrentLap] = useState(null)
    const [currentPosition, setCurrentPosition] = useState(null)

    const svgWidth = 1000
    const svgHeight = 500

    const cardHeight = 100
    const cardWidth = 200
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const margin = 30

    const ref = useD3(svg => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, svgWidth - margin])

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.position)))
            .range([0, svgHeight - margin])

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
                    (d[1])
            })
            .on('mouseover', d => {
                // Thicker line
                svg.select(`#${d.target.id}`)
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 10)

                // Show card
                svg.select('#hover-card-group')
                    .attr('visibility', 'visible')

                setDriverName(driverIdMapper[d.target.getAttribute('driverId')].name)
            })
            .on('mousemove', d => {
                let [xPosition, yPosition] = d3.pointer(d)

                const currentDriverId = +d.target.getAttribute('driverId')
                const closestLap = xScale.invert(xPosition - margin)
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
            .on('mouseout', d => {
                // Reset line thickness
                svg.select(`#${d.target.id}`)
                    .transition()
                    .duration(500)
                    .attr('stroke-width', 5)

                // Hide card group
                svg.select('#hover-card-group')
                    .attr('visibility', 'hidden')
            })
            .on('click', d => {
                if (selectedPaths.has(d.target.id)) {
                    selectedPaths.delete(d.target.id)
                    svg.select(`#${d.target.id}`)
                        .attr('opacity', 0.2)

                    // If no line selected, reset opacity of all lines
                    if (selectedPaths.size === 0) {
                        svg.select('#content')
                            .selectAll('path')
                            .attr('opacity', 1)
                    }
                } else {
                    selectedPaths.add(d.target.id)
                    if (selectedPaths.size === 1) {
                        // Reduce opacity of all lines
                        svg.select('#content')
                            .selectAll('path')
                            .attr('opacity', 0.2)
                    }

                    // Reset opacity of selected line
                    svg.select(`#${d.target.id}`)
                        .attr('opacity', 1)
                }
            })
    }, [data.length])

    return (
        <svg ref={ref} style={{ width: svgWidth, height: svgHeight }}>
            <g id='xAxis' />
            <g id='yAxis' />
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
    )
}

export default RacePositionViz