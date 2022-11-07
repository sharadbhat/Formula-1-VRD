import { forwardRef } from 'react'
import { Select, Text } from '@mantine/core'

// Utils
import useGlobalStore from '../../utils/store'

// CSS
import './styles.css'

const SelectItem = forwardRef(
    ({ label, ...others }, ref) => (
      <div ref={ref} {...others}>
        <div className='text-container'>
            <Text weight={700}>{others.value}</Text><Text>&nbsp;Formula 1 Season</Text>
        </div>
      </div>
    )
  )

const SeasonSelector = () => {
    const setSelectedYear = useGlobalStore((state) => state.setSelectedYear)
    const data = []
    for (let i = 2022; i >= 1993; i--) {
        data.push({
            value: i,
            label: `${i} Formula 1 Season`
        })
    }
    return (
        <Select
            placeholder='Select a season'
            data={data}
            itemComponent={SelectItem}
            transition='pop-top-left'
            transitionDuration={80}
            transitionTimingFunction='ease'
            onChange={setSelectedYear}
        />
    )
}

export default SeasonSelector