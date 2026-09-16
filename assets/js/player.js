let video;
let videoPlayerCard;
let videoPlayerFunctions;
let playpause;
let playIcon;
let pauseIcon;
let initial_video;
let duration_video;
let timeline;
let volumeContainer;
let volumeIcon;
let volumeSlider;
let speedSlider;
let settingsIcon;
let autoplayspeedContainer;
let autoplay;
let fullscreenButton;

let videoTitle;
let videoAuthor;
let videoDescription;

let refreshTime;
let refreshSlider;
let minutes;
let seconds;
let videoTime;
let primeUse = false;
let firstUse = localStorage.getItem("using");
let count = 0;

function setupPlayer() {
    videoPlayerCard = document.getElementById("video_player_card");
    videoPlayerFunctions = document.getElementById("video_functions");
    playpause = document.getElementById("playpause_video");
    initial_video = document.getElementById("initial_video");
    duration_video = document.getElementById("duration_video");
    timeline = document.getElementById("timeline");
    volumeContainer = document.getElementById("volume_container");
    volumeIcon = document.getElementById("volume_icon");
    volumeSlider = document.getElementById("volumeSlider");
    speedSlider = document.getElementById("speedSlider");
    settingsIcon = document.getElementById("settings_icon");
    autoplayspeedContainer = document.getElementById("autoplay_speed_container");
    autoplay = document.getElementById("autoPlay");
    fullscreenButton = document.getElementById("fullscreen_button");

    videoTitle = document.getElementById("video_title");
    videoAuthor = document.getElementById("video_author");
    videoDescription = document.getElementById("video_description")

    playIcon = document.createElement("i");
    playIcon.setAttribute("class", "bi bi-caret-right-fill");
    pauseIcon = document.createElement("i");
    pauseIcon.setAttribute("class", "bi bi-pause");
    
    if (playpause && !playpause.children.length) {
        playpause.appendChild(playIcon);
    }

    if (volumeSlider) {
        volumeSlider.addEventListener("input", setVolume);
    }
    if (speedSlider) {
        speedSlider.addEventListener("input", (e) => setSpeed(e.target.value));
    }

    if (volumeIcon) {
        volumeIcon.addEventListener("click", () => {
            if (video.volume == 0) {
                volumeSlider.value = 50;
            } else {
                volumeSlider.value = 0;
            }
            setVolume();
        })
        volumeIcon.addEventListener("mouseenter", () => {
            volumeSlider.classList.add("active");
        })
    }

    if (volumeContainer) {
        volumeContainer.addEventListener("mouseleave", () => {
            volumeSlider.classList.remove("active");
        })
    }

    if (settingsIcon) {
        settingsIcon.addEventListener("click", () => {
            autoplayspeedContainer.classList.toggle("active");
        })
    }

    if (speedSlider) {
        speedSlider.addEventListener("input", () => setSpeed(speedSlider.value));
    }
    
    createVideo();
    volumePreference();
    speedPreference();
    autoplayPreference();
}

function createVideo() {
    trackIndex = localStorage.getItem("trackIndex") || 0;
    trackPath = trackList[trackIndex].path;
    track = trackList[trackIndex];
    const container = document.getElementById("video_container");
    
    if (!container) return;
    container.innerHTML = ""; 
    
    video = document.createElement("video");
    video.setAttribute("src", trackPath);
    video.setAttribute("width", "800");
    video.setAttribute("type", "video/mp4");
    
    // Rimosso videoInfo() perché i testi sono già stampati da createArticle()
    if (videoPlayerCard) {
        videoPlayerCard.style.backgroundImage = 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8))';
    }
    
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
    if (video.volume == 0) {
        volumeIcon.removeAttribute("class", "bi bi-volume-up-fill");
        volumeIcon.setAttribute("class", "bi bi-volume-mute-fill");
    } else {
        volumeIcon.removeAttribute("class", "bi bi-volume-mute-fill");
        volumeIcon.setAttribute("class", "bi bi-volume-up-fill");
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
        fullscreenButton.appendChild(document.createElement("i")).setAttribute("class", "bi bi-fullscreen");

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
            fullscreenButton.appendChild(document.createElement("i")).setAttribute("class", "bi bi-fullscreen");
        }
    })
}

function openPlayer() {
    createVideo();
    document.getElementById("popup_video_overlay").classList.add("active");
}

function closePlayer() {
    stopVideo();
    document.getElementById("popup_video_overlay").classList.remove("active");
}

async function initArticle() {
    await loadTrackList();

    trackIndex = localStorage.getItem("trackIndex") || 0;
    track = trackList[trackIndex];
    trackPath = track.path;

    createArticle(track);

    setupPlayer();
}

window.addEventListener("DOMContentLoaded", initArticle);

