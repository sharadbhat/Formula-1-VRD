var map = null;

async function init(){
    let mapData = await d3.json('/data/world.json');
    let lap_times = await d3.csv('/data/lap_times.csv');
    let races = await d3.csv('/data/races.csv');
    let drivers = await d3.csv('/data/drivers.csv');
    let circuits = await d3.csv('/data/circuits.csv');

    let lap_times_grouped = d3.group(lap_times, d => d.raceId, d => d.driverId);    
    let circuits_grouped = d3.group(circuits, d => d.circuitId);
    let races_grouped = d3.group(races, d => d.year);

    var dependencies = {
        cumulativeRecordedLaps : null,
        recordedLaps : null,
    }
    let mapGrid = new WorldGrid("worldGrid", "worldMap", mapData, races, circuits);
    let map = new WorldMap("worldMap", mapData, races, circuits);
    //leave as is
    //dependencies.cumulativeRecordedLaps = new CumulativeRecordedLaps("cumulativeRaceGraph", lap_times, drivers, '845', dependencies);
    dependencies.recordedLaps = new RecordedLaps("currentRaceGraph", "currentRaceList", lap_times, drivers, '845', dependencies);
}

init();