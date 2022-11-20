import { forwardRef } from 'react'
import { Select, Text, Card, Group, Badge, Button, Image } from '@mantine/core'
import * as d3 from 'd3'

// Utils
import useGlobalStore from '../../utils/store'
import { useD3 } from '../../utils/useD3'


const RaceScrapeViz = ({raceList, scrapedRaceList}) => {
    const selectedRace = useGlobalStore((state) => state.selectedRace);
    if (scrapedRaceList){
        console.log(raceList);
        return(
            <div>
                {raceList.map(function(race, i){
                    return (
                        <Card shadow="sm" p="md" radius="md" withBorder>
                            <Card.Section>
                                <Image
                                src={scrapedRaceList[race.circuitId].img_url}
                                alt={race.name}
                                />
                            </Card.Section>
                            <Group position="apart" mt="md" mb="xs">
                                <Text weight={500}>{race.name}</Text>
                            </Group>
                            <Text size="sm" color="dimmed">
                                {scrapedRaceList[race.circuitId].description}
                            </Text>
                        </Card>
                    );
                })}
            </div>
        )
    }
}

export default RaceScrapeViz