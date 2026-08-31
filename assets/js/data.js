let trackList = [];

async function loadTrackList() {
    const response = await fetch("assets/data/videosDB.json");
    trackList = await response.json();
    return trackList;
}
