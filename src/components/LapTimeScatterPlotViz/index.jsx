import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import constants from '../../utils/constants'
import useGlobalStore from '../../utils/store'

const LapTimeScatterPlotViz = ({ raceId, data }) => {
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)

    const svgWidth = 1000
    const svgHeight = 500

    const margin = 10

    const circleRadius = 6
    const whiteCircleOpacityNormal = 0.25
    const whiteCircleOpacitySelected = 0.05
    const whiteCircleFill = 'white'

    const ref = useD3(svg => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([margin, svgWidth - margin])

        const rectWidth = (svgWidth - 2 * margin) / d3.max(data.map(d => +d.lap))

        const yScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.milliseconds)))
            .range([svgHeight - margin, margin])

        const groupedData = d3.group(data, d => +d.driverId)

        const colorScale = d3.scaleOrdinal()
            .domain(Array.from(groupedData.keys()))
            .range(constants.categoricalColors)

        svg.select('#content')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', d => xScale(+d.lap))
            .attr('cy', d => yScale(+d.milliseconds))
            .attr('opacity', selectedDrivers.length > 0 ? whiteCircleOpacitySelected : whiteCircleOpacityNormal)
            .attr('fill', whiteCircleFill)
            .attr('r', circleRadius)

        svg.select('#hoverRect')
            .attr('width', rectWidth)
            .attr('height', svgHeight)
            .attr('stroke', 'white')
            .attr('ry', 5)
            .attr('fill', 'none')

        svg.on('mouseover', e => {
            let [xPosition] = d3.pointer(e)

            let currentLap = Math.round(xScale.invert(xPosition))

            svg.select('#hoverRect')
                .attr('x', xScale(currentLap) - rectWidth / 2)

            svg.select('#hoverRect')
                .attr('visibility', 'visible')
        }).on('mousemove', e => {
            let [xPosition] = d3.pointer(e)

            let currentLap = Math.round(xScale.invert(xPosition))

            svg.select('#hoverRect')
                .attr('x', xScale(currentLap) - rectWidth / 2)
        }).on('mouseout', () => {
            svg.select('#hoverRect')
                .attr('visibility', 'hidden')
        })

        svg.select('#selectedContent')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('class', d => `driverId-${d.driverId}`)
            .attr('cx', d => xScale(+d.lap))
            .attr('cy', d => yScale(+d.milliseconds))
            .attr('opacity', 1)
            .attr('visibility', 'hidden')
            .attr('fill', d => colorScale(+d.driverId))
            .attr('r', circleRadius)

        for (const driverId of selectedDrivers) {
            svg.selectAll(`.driverId-${driverId}`)
                .attr('visibility', 'visible')
        }
    }, [data.length, selectedDrivers.length])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='xAxis' />
            <g id='yAxis' />
            <g id='content' />
            <rect id='hoverRect' visibility={'hidden'} />
            <g id='selectedContent' />
        </svg>
    )
}

export default LapTimeScatterPlotViz