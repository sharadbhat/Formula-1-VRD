import { useState } from 'react'
import * as d3 from 'd3'

// Utils
import { useD3 } from '../../utils/useD3'
import constants from '../../utils/constants'

const OvertakeDensityViz = ({ raceId, data }) => {
    const svgWidth = 1000
    const svgHeight = 50

    const margin = 30

    const ref = useD3(svg => {
        svg.select('#content')
            .attr('transform', `translate(${margin}, 0)`)

        const groupedData = d3.group(data, d => +d.driverId)

        let lapwiseOvertakeCounts = {}
        for (const driver of groupedData) {
            for (let i = 1; i < driver[1].length; i++) {
                if (driver[1][i]['position'] !== driver[1][i-1]['position']) {
                    let diff = Math.abs(driver[1][i]['position'] - driver[1][i-1]['position'])
                    lapwiseOvertakeCounts[driver[1][i]['lap']] = (lapwiseOvertakeCounts[driver[1][i]['lap']] || 0) + diff
                }
            }
        }

        let reworkedData = []
        for (let i = 1; i < d3.max(data.map(d => +d.lap)); i++) {
            reworkedData.push({
                lap: i,
                overtakeCount: lapwiseOvertakeCounts[i] / 2 || 0
            })
        }

        const xScale = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.lap)))
            .range([0, 100])

        let colorScale = d3.scaleSequential()
                        .domain([0, d3.max(reworkedData.map(d => +d.overtakeCount))])
                        .interpolator(d3.interpolateInferno)
        
        let linearGradient = svg.select('#linearGradient')

        for (const datapoint of reworkedData) {
            linearGradient.append('stop')
                .attr('offset', `${xScale(datapoint['lap'])}%`)
                .style('stop-color', colorScale(datapoint['overtakeCount']))
        }
    }, [data.length])

    return (
        <svg ref={ref} height={svgHeight} width={svgWidth}>
            <g id='content'>
                <linearGradient id='linearGradient' />
                <rect id='gradientRect' width={svgWidth - margin} height={svgHeight} fill='url(#linearGradient)' />
            </g>
        </svg>
    )
}

export default OvertakeDensityViz