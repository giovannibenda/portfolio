function createArticleCard(track) {

    let article_cards = document.getElementById("article_cards");
    let card = document.createElement("a");
    card.className = "article_card";
    card.setAttribute("data-track-id", track.id);
    card.setAttribute("href", "article.html?" + track.title);
    card.setAttribute("onclick", "setTrackID(" + track.id + ")");

    card.innerHTML = `
        <img src="${track.image ? track.image : 'assets/images/video_cover.jpg'}" alt="${track.title}" class="article_card_image">
        <div class="article_card_info">
            <div class="article_card_title">${track.title}</div>
            <div class="article_card_author">di ${track.author}</div>
            <div class="article_card_description">${track.description}</div>
        </div>
    `;

    article_cards.appendChild(card);
}

function renderArticleCards() {
    trackList.forEach((track) => {
        if (track.genre == localStorage.getItem("selectedCategory")) {
            createArticleCard(track);
        }
    })
}

function setTrackID(element) {
    localStorage.setItem("trackIndex", element);
}

async function initList() {
    await loadTrackList();
    renderArticleCards();
}

window.addEventListener("DOMContentLoaded", initList);
