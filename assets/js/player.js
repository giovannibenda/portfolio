// player.js — pagina del player singolo (player.html)
// Richiede data.js incluso PRIMA di questo file (fornisce trackList e loadTrackList)

let trackIndex;
let trackPath;
let track;
let video;
let videoPlayerCard = document.getElementById("video_player_card");
let videoPlayerFunctions = document.getElementById("video_functions");
let playpause = document.getElementById("playpause_video");
let playIcon = document.createElement("i");
playIcon.setAttribute("class", "bi bi-caret-right-fill");
let pauseIcon = document.createElement("i");
pauseIcon.setAttribute("class", "bi bi-pause");
let initial_video = document.getElementById("initial_video");
let duration_video = document.getElementById("duration_video");
let timeline = document.getElementById("timeline");
let volumeSlider = document.getElementById("volumeSlider");
let speedSlider = document.getElementById("speedSlider");
let videoTitle = document.getElementById("video_title");
let videoDescription = document.getElementById("video_description");
let videoAuthor = document.getElementById("video_author");
let autoplay = document.getElementById("autoPlay");
let fullscreenButton = document.getElementById("fullscreen_button");
let refreshTime;
let refreshSlider;
let minutes;
let seconds;
let videoTime;
let primeUse = false;
let firstUse = localStorage.getItem("using");
let count = 0;

function createVideo() {
    trackIndex = localStorage.getItem("trackIndex") || 0;
    trackPath = trackList[trackIndex].path;
    track = trackList[trackIndex];
    const container = document.getElementById("video_container");
    container.innerHTML = ""; // Rimuove eventuali video precedenti
    video = document.createElement("video");
    video.setAttribute("src", trackPath);
    video.setAttribute("width", "800");
    video.setAttribute("height", "");
    video.setAttribute("type", "video/mp4");
    videoInfo();
    container.appendChild(video);
}

// Carica un nuovo video nel player (usata da previousTrack/nextTrack e all'avvio)
function videoPlayer(autostart, volumeValue, speedValue, autoplayValue) {

    video.setAttribute("src", trackPath);
    videoInfo();

    volumeSlider.value = volumeValue;
    speedSlider.value = speedValue;
    autoplay.checked = autoplayValue;
    setVolume();
    setSpeed(speedSlider.value);

    timeline.value = 0;
    initial_video.innerHTML = "00:00";

    if (autostart == 1) {
        playpauseVideo();
    }
}

function autoPlay() {
    // Il checkbox si aggiorna già da solo al click, qui salviamo solo la preferenza
    localStorage.setItem("autoplayValue", autoplay.checked);
}

function autoplayPreference() {
    let autoplay_value = localStorage.getItem("autoplayValue");
    if (autoplay_value === null) {
        autoplay_value = "true";
    }
    autoplay.checked = (autoplay_value === "true");
}

function videoInfo() {
    document.getElementById("video_player_card").style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))';
    videoTitle.innerHTML = track.title;
    videoDescription.innerHTML = track.description;
    videoAuthor.innerHTML = "di " + track.author;
}

function addSeconds() {
    video.currentTime = video.currentTime + 20;
    timeline.value = (video.currentTime * 100) / video.duration;
}

function removeSeconds() {
    video.currentTime = video.currentTime - 20;
    timeline.value = (video.currentTime * 100) / video.duration;
}

function setVolume() {
    video.volume = volumeSlider.value / 100;
    localStorage.setItem("volumeValue", volumeSlider.value);
    let volumeIcon = document.getElementById("volume_icon");
    if (video.volume == 0) {
        volumeIcon.addAttribute("class", "bi bi-volume-mute-fill");
    } else {
        volumeIcon.removeAttribute("class", "bi bi-volume-up-fill");
    }
}

function volumePreference() {
    let volume_value = Number(localStorage.getItem("volumeValue"));
    if (firstUse == "true" || !volume_value) {
        volume_value = 50;
    }
    video.volume = volume_value / 100;
    volumeSlider.value = volume_value;
    localStorage.setItem("using", "false");
}

function setSpeed(x) {
    const speedMap = { 0: 0.5, 1: 0.8, 2: 1, 3: 1.2, 4: 1.5, 5: 2 };
    let rate = speedMap[x] !== undefined ? speedMap[x] : 1;
    video.playbackRate = rate;
    document.querySelector("#speed").innerHTML = rate + "x";
    localStorage.setItem("speedValue", speedSlider.value);
}

function speedPreference() {
    let speed_value = localStorage.getItem("speedValue");
    if (speed_value != null) {
        speedSlider.value = speed_value;
    }
    setSpeed(speedSlider.value);
}

function formatTime(x) {
    minutes = Math.floor(x / 60);
    seconds = Math.floor(x % 60);
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    videoTime = minutes + ':' + seconds;
    return videoTime;
}

function setTimeline() {
    setVolume();
    setSpeed(speedSlider.value);
    video.currentTime = (timeline.value * video.duration) / 100;
    initial_video.innerHTML = (video.currentTime < 0.01) ? "00:00" : formatTime(video.currentTime);

    clearInterval(refreshSlider);
    refreshSlider = setInterval(function () {
        setVolume();
        setSpeed(speedSlider.value);
        duration_video.innerHTML = formatTime(video.duration);
        initial_video.innerHTML = (video.currentTime < 0.01) ? "00:00" : formatTime(video.currentTime);
        timeline.value = (video.currentTime * 100) / video.duration;
        checkEndOfVideo();
    }, 500);
}

function checkEndOfVideo() {
    if (video.currentTime >= video.duration) {
        video.pause();
        video.currentTime = 0;
        playpause.removeChild(playpause.firstElementChild);
        playpause.appendChild(playIcon);
        initial_video.innerHTML = "00:00";
        timeline.value = 0;
        count = 0;
        if (autoplay.checked == true && trackIndex < trackList.length - 1) {
            nextTrack();
        }
    }
}

function playpauseVideo() {
    if (count == 0) {
        count = 1;
        setVolume();
        setSpeed(speedSlider.value);
        video.play();
        playpause.removeChild(playpause.firstElementChild);
        playpause.appendChild(pauseIcon);
        video.currentTime = (timeline.value * video.duration) / 100;

        clearInterval(refreshTime);
        refreshTime = setInterval(function () {
            setVolume();
            setSpeed(speedSlider.value);
            duration_video.innerHTML = formatTime(video.duration);
            initial_video.innerHTML = (video.currentTime < 0.01) ? "00:00" : formatTime(video.currentTime);
            timeline.value = (video.currentTime * 100) / video.duration;
            checkEndOfVideo();
        }, 200);
    } else {
        count = 0;
        video.pause();
        playpause.removeChild(playpause.firstElementChild);
        playpause.appendChild(playIcon);
        initial_video.innerHTML = formatTime(video.currentTime);
        timeline.value = (video.currentTime * 100) / video.duration;
    }
}

function stopVideo() {
    video.pause();
    video.currentTime = 0;
    if (playpause.firstElementChild) {
        playpause.removeChild(playpause.firstElementChild);
    }
    playpause.appendChild(playIcon);
    count = 0;
    initial_video.innerHTML = "00:00";
    timeline.value = 0;
    clearInterval(refreshTime);
    clearInterval(refreshSlider);
}

function toggleFullscreen() {
    if (videoPlayerCard.classList.contains("fullscreen")) {
        videoPlayerCard.classList.remove("fullscreen");
        video.classList.remove("fullscreen");
        videoPlayerFunctions.classList.remove("active");
        fullscreenButton.removeChild(fullscreenButton.firstElementChild);
        fullscreenButton.appendChild(document.createElement("i")).setAttribute("class", "bi bi-arrows-fullscreen");

    } else {
        videoPlayerCard.classList.add("fullscreen");
        video.classList.add("fullscreen");
        videoPlayerFunctions.classList.add("active");
        fullscreenButton.removeChild(fullscreenButton.firstElementChild);
        fullscreenButton.appendChild(document.createElement("i")).setAttribute("class", "bi bi-fullscreen-exit");
    }
    window.addEventListener("keydown", function(event) {
        if (event.key === "Escape" && videoPlayerCard.classList.contains("fullscreen")) {
            videoPlayerCard.classList.remove("fullscreen");
            video.classList.remove("fullscreen");
            videoPlayerFunctions.classList.remove("active");
            fullscreenButton.removeChild(fullscreenButton.firstElementChild);
            fullscreenButton.appendChild(document.createElement("i")).setAttribute("class", "bi bi-arrows-fullscreen");
        }
    })
}

// Aggiornamento immediato quando l'utente muove gli slider (oltre al polling durante la riproduzione)
volumeSlider.addEventListener("input", setVolume);
speedSlider.addEventListener("input", () => setSpeed(speedSlider.value));

// --- Inizializzazione pagina player ---
async function initPlayer() {
    await loadTrackList();

    trackIndex = localStorage.getItem("trackIndex") || 0;
    trackPath = trackList[trackIndex].path;
    track = trackList[trackIndex]

    createVideo();
    videoInfo();
    volumePreference();
    speedPreference();
    autoplayPreference();

    playpause.appendChild(playIcon);
}

window.addEventListener("DOMContentLoaded", initPlayer);
