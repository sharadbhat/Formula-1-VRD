import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

let scrapedDriverData = []

const getScrapedDriverData = async () => {
    if (scrapedDriverData.length === 0) {
        const data = await d3.csv(getDataFilePath('driver_descr_img.csv'))
        scrapedDriverData = data
    }
    
    let result = scrapedDriverData.reduce(function(map, obj) {
        map[obj.driverId] = {
            description: obj.description,
            img_url: obj.img_url
        }
        return map
    }, {})

    return result
}

export default getScrapedDriverData