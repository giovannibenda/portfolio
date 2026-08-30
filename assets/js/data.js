// data.js — caricamento condiviso della lista video da JSON
// Includere questo file PRIMA di list.js (in index.html) o player.js (in player.html)

let trackList = [];

async function loadTrackList() {
    const response = await fetch("assets/data/videosDB.json");
    trackList = await response.json();
    return trackList;
}
