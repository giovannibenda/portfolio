function createVideoCard(track) {

    let video_cards = document.getElementById("video_cards");
    let card = document.createElement("div");
    card.className = "video_card";

    card.addEventListener("click", () => openPlayer(track));

    card.innerHTML = `
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
    `;

    video_cards.appendChild(card);
}

function renderVideoCards() {
    trackList.forEach((track) => {
        if (track.genre == localStorage.getItem("selectedCategory")) {
            createVideoCard(track);
        }
    })
}

function openPlayer(track) {
    localStorage.setItem("trackIndex", track.id);
    createVideo();
    document.getElementById("popup_video_overlay").classList.add("active");
}

function closePlayer() {
    stopVideo();
    document.getElementById("popup_video_overlay").classList.remove("active");
    localStorage.removeItem('trackIndex');
}

async function main() {
    await loadTrackList();
    renderVideoCards();
}

window.addEventListener("DOMContentLoaded", main);
