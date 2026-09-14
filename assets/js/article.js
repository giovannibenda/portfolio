function createArticle (track) {
    let category = localStorage.getItem("selectedCategory");
    let categoryTitle = document.getElementById("category");
    categoryTitle.innerHTML = "LAVORO / " + category.charAt(0).toUpperCase() + category.slice(1) + " / " + track.title;
    let article = document.getElementById("article");
    article.innerHTML = `
        <div class="article_grid">
            <div class="video_card_preview">
                <div class="video_card_overlay">
                    <img src="${track.image ? track.image : 'assets/default-thumbnail.jpg'}" alt="${track.title}" class="video_thumbnail">
                    <div class="play_button"></div> 
                </div>
                <div class="video_card_info">
                    <div class="video_card_title">${track.title}</div>
                    <div class="video_card_author">di ${track.author}</div>
                </div>
            </div>
            <p>${track.description}</p>
        </div>
        <div id="popup_video_overlay" class="popup_video_overlay">
            <div id="video_player_card" class="video_player_card">
                <button class="close-popup-btn" onclick="closePlayer()">&times;</button>
                <div class="video_player">
                    <div id="video_container" class="video_container"></div>
                    <div id="video_functions" class="video_functions">
                        <div class="timeline">
                            <input type="range" min="1" max="100" value="0" id="timeline" class="video_timeline" onclick="setTimeline()">
                        </div>
                        <div class="video_settings">
                            <button id="playpause_video" class="button_player" onclick="playpauseVideo()"></button>
                            <div class="video_duration">
                                <div id="initial_video" class="initial_video">00:00</div>
                                <div id="slash" class="slash"> / </div>
                                <div id="duration_video" class="duration_video">00:00</div>
                            </div>
                            <div id="volume_container" class="volume_container">
                                <i id="volume_icon" class="bi bi-volume-up-fill"></i>
                                <input type="range" min="0" max="100" value="50" id="volumeSlider" class="volumeSlider">
                            </div>
                            <div class=""></div>
                            <button id="settings_button" class="settings_button">
                                <i id="settings_icon" class="bi bi-sliders2-vertical"></i>
                                <div class="settings_container">
                                    <div id="autoplay_speed_container" class="autoplay_speed_container">
                                        <div class="speed_container">
                                            <p id="speed">1x</p>
                                            <div class="speed_slider">
                                                <div>Speed</div>
                                                <input type="range" min="0" max="5" value="2" id="speedSlider" class="speedSlider">
                                            </div>
                                        </div>
                                        <div class="autoplay_box">
                                            <div>
                                                <div>Autoplay</div>
                                                <input type="checkbox" value="on" checked="true" id="autoPlay" onclick="autoPlay()" class="autoplayBox">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </button>
                            <button id="fullscreen_button" class="" onclick="toggleFullscreen()">
                                <i class="bi bi-fullscreen"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initArticle() {
    await loadTrackList();

    trackIndex = localStorage.getItem("trackIndex") || 0;
    trackPath = trackList[trackIndex].path;
    track = trackList[trackIndex]

    createArticle(track);
}

window.addEventListener("DOMContentLoaded", initArticle);