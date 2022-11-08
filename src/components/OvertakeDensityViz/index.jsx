import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'

const OvertakeDensityViz = ({ raceId, data }) => {
    const svgWidth = 1000
    const svgHeight = 50

    const margin = 30

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
            .range([0, svgWidth - margin])

        const yScale = d3.scaleLinear()
            .domain([0, d3.max(reworkedData.map(d => +d.overtakeCount))])
            .range([svgHeight - 0.5, 0])

        const colorScale = d3.scaleSequential()
                        .domain([0, 1.5 * d3.max(reworkedData.map(d => +d.overtakeCount))])
                        .interpolator(d3.interpolateInferno)
        
        const linearGradient = svg.select('#linearGradient')

        for (const datapoint of reworkedData) {
            linearGradient.append('stop')
                .attr('offset', `${xScalePercent(datapoint['lap'])}%`)
                .style('stop-color', colorScale(datapoint['overtakeCount']))
        }

        const lineGenerator = d3.line()
            .x(d => xScaleWidth(d.lap))
            .y(d => yScale(d.overtakeCount))
            .curve(d3.curveBasis)

        svg.select('#gradientLine')
            .datum(reworkedData)
            .attr('d', lineGenerator)

    }, [data.length])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='content'>
                <linearGradient id='linearGradient' />
                <rect id='gradientRect' width={svgWidth - margin} height={svgHeight} fill='url(#linearGradient)' />
                <path id='gradientLine' stroke='#ffffff' strokeWidth={2} fill='none' />
            </g>
        </svg>
    )
}

export default OvertakeDensityViz