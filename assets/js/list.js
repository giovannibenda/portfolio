// list.js — pagina con le anteprime dei video (index.html)
// Richiede data.js incluso PRIMA di questo file (fornisce trackList e loadTrackList)

function createVideoCard(i) {
    let track = trackList[i];

    let video_cards = document.getElementById("video_cards");
    let card = document.createElement("div");
    card.className = "video_card";

    // Al click, naviga alla pagina del player passando l'indice del video
    card.addEventListener("click", () => goToPlayer(i));

    card.innerHTML = `
        <div class="video_card_preview">
            <img src="${track.thumbnail ? track.thumbnail : 'assets/default-thumbnail.jpg'}"
                 alt="${track.title}" class="video_thumbnail">
            <div class="video_card_info">
                <h3 class="video_title">${track.title}</h3>
                <p class="video_author">${track.author}</p>
            </div>
        </div>
    `;

    video_cards.appendChild(card);
}

function goToPlayer(i) {
    // Passiamo solo l'indice nella URL: la pagina player leggerà trackList[index]
    window.location.href = `player.html?index=${i}`;
}

function renderVideoCards() {
    trackList.forEach((track, i) => createVideoCard(i));
}

async function main() {
    await loadTrackList();
    renderVideoCards();
}

window.addEventListener("DOMContentLoaded", main);
