import * as d3 from 'd3'

// Utils
import { getDataFilePath } from './getFilePath'

let scrapedTrackData = []

const getScrapedTrackData = async () => {
    if (scrapedTrackData.length === 0) {
        const data = await d3.csv(getDataFilePath('track_descr_img.csv'));
        scrapedTrackData = data;
    }
    
    var result = scrapedTrackData.reduce(function(map, obj) {
        map[obj.trackId] = {description : obj.description, img_url : obj.img_url};
        return map;
    }, {});

    return result;
}

export default getScrapedTrackData