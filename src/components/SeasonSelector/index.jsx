import { forwardRef, useContext } from 'react'
import { Select, Text } from '@mantine/core'
import GlobalContext from '../../utils/globalContext';

const SelectItem = forwardRef(
    ({ label, ...others }, ref) => (
      <div ref={ref} {...others}>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
            <Text weight={700}>{others.value}</Text><Text>&nbsp;Formula 1 Season</Text>
        </div>
      </div>
    )
  );

const SeasonSelector = () => {
    let context = useContext(GlobalContext);
    let data = []
    for (let i = 1950; i <= 2022; i++) {
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
            onChange={context.setSelectedYear}
        />
    )
}

export default SeasonSelector