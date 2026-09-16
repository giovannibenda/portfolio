let trackList;
let trackIndex;
let trackPath;
let track;

async function loadTrackList() {
    const response = await fetch("assets/data/videosDB.json");
    trackList = [];
    trackList = await response.json();
    return trackList;
}
