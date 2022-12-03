import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import useGlobalStore from '../../utils/store'
import constants from '../../utils/constants'

const OvertakeDensityViz = ({ data }) => {
    const width = window.innerWidth

    const hoveredLap = useGlobalStore((state) => state.hoveredLap)
    const setHoveredLap = useGlobalStore((state) => state.setHoveredLap)

    const [positionsChanged, setPositionsChanged] = useState(null)

    const svgWidth = 0.45 * width
    const svgHeight = 75

    const margin = 30
    const padding = 15

    const cardHeight = 40
    const cardWidth = 200
    const cardCornerRadius = constants.cardCornerRadius
    const cardColor = constants.cardColor

    const ref = useD3(svg => {
        svg.select('#content')
        .attr('transform', `translate(${margin}, 0)`)

        const groupedData = d3.group(data, d => +d.driverId)

        const lapwiseOvertakeCounts = {}
        for (const driver of groupedData) {
            for (let i = 1; i < driver[1].length; i++) {
                if (driver[1][i]['position'] !== driver[1][i-1]['position']) {
                    let diff = Math.abs(driver[1][i]['position'] - driver[1][i-1]['position'])
                    lapwiseOvertakeCounts[driver[1][i]['lap']] = (lapwiseOvertakeCounts[driver[1][i]['lap']] || 0) + diff
                }
            }
        }

        if (hoveredLap) {
            setPositionsChanged(Math.round(lapwiseOvertakeCounts[hoveredLap] / 2 || 0))
        }

        const reworkedData = []
        for (let i = 1; i <= d3.max(data.map(d => +d.lap)); i++) {
            reworkedData.push({
                lap: i,
                overtakeCount: lapwiseOvertakeCounts[i] / 2 || 0
            })
        }

        const xScalePercent = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, 100])

        const xScaleWidth = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, svgWidth - margin - padding])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(reworkedData.map(d => +d.overtakeCount))])
            .range([svgHeight - 5, svgHeight / 8])

        const colorScale = d3.scaleSequential()
                        .domain([0, 1.5 * d3.max(reworkedData.map(d => +d.overtakeCount))])
                        .interpolator(d3.interpolateInferno)

        const linearGradient = svg.select('#linearGradient')

        linearGradient
            .selectAll('stop')
            .data(reworkedData)
            .join('stop')
            .attr('offset', d => `${xScalePercent(d['lap'])}%`)
            .style('stop-color', d => colorScale(d['overtakeCount']))

        const lineGenerator = d3.line()
            .x(d => xScaleWidth(d.lap))
            .y(d => yScale(d.overtakeCount))
            .curve(d3.curveCardinal)

        svg.select('#gradientLine')
            .datum(reworkedData)
            .transition()
            .duration(200)
            .attr('d', lineGenerator)

        let hoverLinePosition = xScaleWidth(hoveredLap)

        svg.select('#hoverCircle')
            .attr('visibility', hoveredLap ? 'visible' : 'hidden')
            .attr('cx', hoverLinePosition)
            .attr('cy', yScale((lapwiseOvertakeCounts[hoveredLap] / 2) || 0))

        svg.on('mouseenter', e => {
            let [xPosition] = d3.pointer(e)

            let [xScaleStart, xScaleEnd] = xScaleWidth.domain()

            let closestLap = Math.round(xScaleWidth.invert(xPosition - margin))

            if (closestLap > xScaleEnd) {
                closestLap = null
            } else if (closestLap < xScaleStart) {
                closestLap = null
            }

            setHoveredLap(closestLap)
        }).on('mousemove', e => {
            let [xPosition] = d3.pointer(e)

            let [xScaleStart, xScaleEnd] = xScaleWidth.domain()

            let closestLap = Math.round(xScaleWidth.invert(xPosition - margin))

            if (closestLap > xScaleEnd) {
                closestLap = null
            } else if (closestLap < xScaleStart) {
                closestLap = null
            }

            setHoveredLap(closestLap)
        }).on('mouseleave', () => {
            setHoveredLap(null)
        })

        svg.select('#hover-card-group')
            .attr('transform', () => {
                let xPosition = xScaleWidth(hoveredLap)

                if (xPosition > ((svgWidth / 2) + margin + padding)) {
                    xPosition -= 190
                } else {
                    xPosition += 50
                }

                return `translate(${xPosition}, 0)`
            })
            .attr('visibility', hoveredLap ? 'visible' : 'hidden')

    }, [data.length, hoveredLap])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='content'>
                <linearGradient id='linearGradient' />
                <rect id='gradientRect' width={svgWidth - margin - padding} height={svgHeight} fill='url(#linearGradient)' />
                <circle
                    id='hoverCircle'
                    r={5}
                    fill={'white'}
                    cx={0}
                    cy={0}
                />
                <path id='gradientLine' stroke='#ffffff' strokeWidth={2} fill='none' />
            </g>
            <g id='hover-card-group' visibility={'hidden'}>
                <rect
                    id='hover-card'
                    fill={cardColor}
                    height={cardHeight}
                    width={cardWidth}
                    rx={cardCornerRadius}
                    ry={cardCornerRadius}
                    y={(svgHeight / 2) - (cardHeight / 2)}
                />
                <g id='hover-card-content-group'>
                    <text
                        id='hover-card-current-lap'
                        textAnchor='middle'
                        fill='white'
                        x={cardWidth / 2}
                        y={(svgHeight / 2) + 5}
                    >
                        Positions Changed: {positionsChanged}
                    </text>
                </g>
            </g>
        </svg>
    )
}

export default OvertakeDensityViz