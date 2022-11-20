import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import constants from '../../utils/constants'
import useGlobalStore from '../../utils/store'

const LapTimeScatterPlotViz = ({ raceId, data }) => {
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers)
    const hoveredDriverId = useGlobalStore(state => state.hoveredDriverId)
    const hoveredLap = useGlobalStore(state => state.hoveredLap)
    const setHoveredLap = useGlobalStore(state => state.setHoveredLap)

    const svgWidth = 1000
    const svgHeight = 500

    const margin = 30

    const circleRadius = 6
    const whiteCircleOpacityNormal = 0.25
    const whiteCircleOpacitySelected = 0.1
    const whiteCircleFill = 'white'

    const ref = useD3(svg => {
        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, svgWidth - 3 * margin])

        const rectWidth = (svgWidth - margin) / d3.max(data.map(d => +d.lap))

        const yScale = d3.scaleLinear()
            .domain([d3.min(data.map(d => +d.milliseconds)) / 1.1, d3.max(data.map(d => +d.milliseconds)) * 1.1])
            .range([svgHeight - margin, margin])

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
            <rect id='hoverRect' visibility={'hidden'} height={svgHeight - 2 * margin} y={margin} />
            <g id='selectedContent' />
        </svg>
    )
}

export default LapTimeScatterPlotViz