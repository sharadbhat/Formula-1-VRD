import { forwardRef } from 'react'
import { Select, Text, Card, Group, Badge, Button, Image, Grid} from '@mantine/core'
import * as d3 from 'd3'

// Utils
import useGlobalStore from '../../utils/store'
import { useD3 } from '../../utils/useD3'
import driverIdMapper from '../../utils/driverIdMapper'

const DriverDetails = ({data, scrapedDriverList}) => {
    const selectedRace = useGlobalStore((state) => state.selectedRace);
    const hoveredDriverId = useGlobalStore(state => state.hoveredDriverId);
    const selectedDrivers = useGlobalStore(state => state.selectedDrivers);

    console.log(data);
    if (selectedDrivers){
        return(
            <div>
                <Grid>
                    {selectedDrivers.map(function(driver, i){
                        return (
                            <Grid.Col span={3}>
                                <Card shadow="sm" p="md" radius="md" withBorder>
                                    <Card.Section>
                                        <Image
                                        src={scrapedDriverList[driver].img_url}
                                        alt={driverIdMapper[driver].name}
                                        />
                                    </Card.Section>
                                    <Group position="apart" mt="md" mb="xs">
                                        <Text weight={500}>{driverIdMapper[driver].name}</Text>
                                    </Group>
                                    <Text size="sm" color="dimmed">
                                        {scrapedDriverList[driver].description}
                                    </Text>
                                </Card>
                            </Grid.Col>
                        );
                    })}
                </Grid>
            </div>
        )
    }
}

export default DriverDetails