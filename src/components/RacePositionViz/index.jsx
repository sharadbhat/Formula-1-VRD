import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'

const RacePositionViz = ({ data }) => {
    const selectedPaths = new Set()
    const svgWidth = 1000
    const svgHeight = 500

    const cardHeight = 40
    const cardWidth = 150
    const cardCornerRadius = 10
    const cardColor = '#25262b'

    const margin = 30

    const ref = useD3(svg => {
        let xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, svgWidth - margin])

        let yScale = d3.scaleLinear()
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

        let colorScale = d3.scaleOrdinal()
            .domain(Array.from(groupedData.keys()))
            .range(['#32964d', '#21f0b6', '#195036', '#ace1b7', '#0a7fb2', '#9ab9f9', '#82269b', '#fa79f5', '#6e446b', '#20d8fd', '#135ac2', '#faafe3', '#7d0af6', '#bae342', '#6e3901', '#fe8f06', '#a20655', '#fb8c77', '#d02023', '#d8c3b4', '#738a69', '#67f059', '#e0c645'])

        svg.select('#content')
            .selectAll('path')
            .data(groupedData)
            .enter()
            .append('path')
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

                svg.select('#hover-card-content')
                    .text(driverIdMapper[d.target.getAttribute('driverId')].name)
            })
            .on('mousemove', d => {
                let [xPosition, yPosition] = d3.pointer(d)
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
                <text
                    id='hover-card-content'
                    textAnchor='middle'
                    fill='white'
                    x={cardWidth / 2}
                    y={cardHeight / 2 + 5}
                />
            </g>
        </svg>
    )
}

export default RacePositionViz