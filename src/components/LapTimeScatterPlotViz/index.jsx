import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import constants from '../../utils/constants'
import useGlobalStore from '../../utils/store'
import driverIdMapper from '../../utils/driverIdMapper'

const LapTimeScatterPlotViz = ({ data }) => {
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)
    const setHoveredDriverId = useGlobalStore((state) => state.setHoveredDriverId)
    const hoveredDriverId = useGlobalStore(state => state.hoveredDriverId)
    const setHoveredLap = useGlobalStore(state => state.setHoveredLap)
    const hoveredLap = useGlobalStore(state => state.hoveredLap)

    const [driverName, setDriverName] = useState(null)
    const [currentLaptime, setCurrentLaptime] = useState(null)

    const svgWidth = 550
    const svgHeight = 500

    const cardHeight = 100
    const cardWidth = 200
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const margin = 30
    const padding = 15

    const whiteCircleOpacityNormal = 0.25
    const whiteCircleOpacitySelected = 0.1
    const whiteCircleFill = 'white'

    const ref = useD3(svg => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, svgWidth - 3 * margin])

        const rectWidth = Math.min((svgWidth - margin) / d3.max(data.map(d => +d.lap)), 20)
        const circleRadius = Math.min(rectWidth / 2, 10)

        const yScale = d3.scaleLinear()
            .domain([d3.min(data.map(d => +d.milliseconds)) / 1.1, d3.max(data.map(d => +d.milliseconds)) * 1.1])
            .range([svgHeight - margin, padding])

        svg.select('#xAxis')
            .attr('transform', `translate(${2 * margin}, ${svgHeight - margin})`)
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .call(d3.axisBottom(xScale))

        svg.select('#yAxis')
            .attr('transform', `translate(${2 * margin}, 0)`)
            .attr('stroke-width', 2)
            .transition()
            .duration(500)
            .call(d3.axisLeft(yScale).tickFormat(d => d3.timeFormat('%M:%S.%L')(d)))

        const groupedData = d3.group(data, d => +d.driverId)

        const colorScale = d3.scaleOrdinal()
            .domain(Array.from(groupedData.keys()))
            .range(constants.categoricalColors)

        svg.select('#content')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('opacity', selectedDrivers.length > 0 ? whiteCircleOpacitySelected : whiteCircleOpacityNormal)
            .attr('fill', whiteCircleFill)
            .attr('r', circleRadius)
            .attr('cx', d => xScale(+d.lap) + 2 * margin)
            .attr('cy', d => yScale(+d.milliseconds))
            .on('mouseenter', (event, data) => {
                let [xPosition, yPosition] = d3.pointer(event)

                setCurrentLaptime(data['time'])
                setDriverName(driverIdMapper[+data.driverId].name)
                setHoveredDriverId(+data.driverId)

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
            .on('mousemove', (event, data) => {
                let [xPosition, yPosition] = d3.pointer(event)

                setCurrentLaptime(data['time'])
                setDriverName(driverIdMapper[+data.driverId].name)

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

        svg.select('#hoverRect')
            .attr('width', rectWidth)
            .attr('stroke', 'white')
            .attr('ry', 5)
            .attr('fill', 'none')
            .attr('x', xScale(hoveredLap) + 2 * margin - rectWidth / 2)
            .attr('visibility', hoveredLap ? 'visible' : 'hidden')

        svg.on('mouseenter', e => {
            let [xPosition] = d3.pointer(e)

            let currentLap = Math.round(xScale.invert(xPosition - 2 * margin))

            let [xScaleStart, xScaleEnd] = xScale.domain()

            if (currentLap > xScaleEnd) {
                currentLap = null
            } else if (currentLap < xScaleStart) {
                currentLap = null
            }

            setHoveredLap(currentLap)
        }).on('mousemove', e => {
            let [xPosition] = d3.pointer(e)

            let currentLap = Math.round(xScale.invert(xPosition - 2 * margin))

            let [xScaleStart, xScaleEnd] = xScale.domain()

            if (currentLap > xScaleEnd) {
                currentLap = null
            } else if (currentLap < xScaleStart) {
                currentLap = null
            }

            setHoveredLap(currentLap)
        }).on('mouseleave', () => {
            setHoveredLap(null)
        })

        svg.select('#selectedContent')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('class', d => `driverId-${d.driverId}`)
            .attr('cx', d => xScale(+d.lap) + 2 * margin)
            .attr('cy', d => yScale(+d.milliseconds))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('visibility', 'hidden')
            .attr('fill', d => colorScale(+d.driverId))
            .attr('r', circleRadius)
            .on('mouseenter', (event, data) => {
                let [xPosition, yPosition] = d3.pointer(event)

                setCurrentLaptime(data['time'])
                setDriverName(driverIdMapper[+data.driverId].name)
                setHoveredDriverId(+data.driverId)

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
            .on('mousemove', (event, data) => {
                let [xPosition, yPosition] = d3.pointer(event)

                setCurrentLaptime(data['time'])
                setDriverName(driverIdMapper[+data.driverId].name)

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

        for (const driverId of selectedDrivers) {
            svg.selectAll(`.driverId-${driverId}`)
                .attr('visibility', 'visible')
        }

        svg.selectAll(`.driverId-${hoveredDriverId}`)
            .attr('visibility', 'visible')

    }, [data.length, selectedDrivers.length, hoveredDriverId, hoveredLap])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='xAxis' />
            <g id='yAxis' />
            <g id='content' />
            <rect id='hoverRect' visibility={'hidden'} height={svgHeight - margin - padding} y={padding} />
            <g id='selectedContent' />
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
                        Laptime: {currentLaptime}
                    </text>
                </g>
            </g>
        </svg>
    )
}

export default LapTimeScatterPlotViz