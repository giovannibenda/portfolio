function createArticle (track) {
    let category = localStorage.getItem("selectedCategory");
    let categoryTitle = document.getElementById("category");
    categoryTitle.innerHTML = "LAVORO / " + category.charAt(0).toUpperCase() + category.slice(1) + " / " + track.title;
    let article = document.getElementById("article");
    article.innerHTML = `
        <div class="article_grid">
            <div class="video_card_preview" onclick="openPlayer()">
                <div class="video_card_overlay">
                    <img src="${track.image ? track.image : 'assets/default-thumbnail.jpg'}" alt="${track.title}" class="video_thumbnail">
                    <div class="play_button"></div> 
                </div>
            </div>
            <div class="video_card_info">
                <div class="article_title">${track.title}</div>
                <div class="article_author">di ${track.author}</div>
            </div>
        </div>
        <div id="video_card_description" class="video_card_description"></div>
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
                    <div class="video_info">
                        <div id="video_title" class="video_title">${track.title}</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

async function initArticle() { 
    await loadTrackList(); 
    let trackIndex = localStorage.getItem("trackIndex") || 0; 
    let track = trackList[trackIndex]; 

    createArticle(track); 

    let articleContainer = document.getElementById("video_card_description"); 
    if (!articleContainer) return;

    const limite = 500; 
    const testoCompleto = track.description || ''; 
    const haImmagini = track.graphic && track.graphic.length > 0;
    
    if (haImmagini) { 
        
        // 1. Primo paragrafo iniziale (senza immagini)
        let indicePunto = testoCompleto.indexOf('.', limite);
        if (indicePunto === -1 || testoCompleto.length <= limite) {
            indicePunto = testoCompleto.length; 
        } else {
            indicePunto = indicePunto + 1; 
        }
        
        let primoParagrafo = testoCompleto.substring(0, indicePunto).trim(); 
        if (primoParagrafo.length > 0) {
            let articleSection1 = document.createElement("div");
            articleSection1.textContent = primoParagrafo;
            articleContainer.appendChild(articleSection1);
        }

        // Testo rimanente da distribuire
        let testoRimanente = testoCompleto.substring(indicePunto).trim();

        // 2. Ciclo su TUTTE le immagini disponibili
        for (let i = 0; i < track.graphic.length; i++) { 
            
            // --- PARTE A: CREAZIONE DEL CONTAINER GRAFICO ---
            let articleSubContainer = document.createElement("div");
            articleSubContainer.className = "graphic_container";
            
            let articleGraphic = document.createElement("img"); 
            articleGraphic.setAttribute("src", track.graphic[i]);

            let testoParagrafo = '';

            // Estraiamo il testo da affiancare all'immagine corrente
            if (testoRimanente.length > 0) {
                let prossimoPunto = testoRimanente.indexOf('.', limite);
                if (prossimoPunto === -1 || testoRimanente.length <= limite) {
                    prossimoPunto = testoRimanente.length;
                } else {
                    prossimoPunto = prossimoPunto + 1; 
                }

                testoParagrafo = testoRimanente.substring(0, prossimoPunto).trim();
                testoRimanente = testoRimanente.substring(prossimoPunto).trim();
            }

            let nuovaSezione = null;
            if (testoParagrafo.length > 0) {
                nuovaSezione = document.createElement("div"); 
                nuovaSezione.textContent = testoParagrafo; 
            }

            // Alternanza del layout affiancato
            if (i % 2 === 0) {
                if (nuovaSezione) articleSubContainer.appendChild(nuovaSezione);
                articleSubContainer.appendChild(articleGraphic); 
            } else {
                articleSubContainer.appendChild(articleGraphic);
                if (nuovaSezione) articleSubContainer.appendChild(nuovaSezione);
            }
            
            // Appendiamo il blocco grafico al container principale
            articleContainer.appendChild(articleSubContainer);


            // --- PARTE B: CREAZIONE DEL PARAGRAFO SEPARATORE DI SOLO TESTO (A TUTTA LARGHEZZA) ---
            // Estraiamo subito il blocco successivo di testo per metterlo sotto il container appena creato
            if (testoRimanente.length > 0) {
                let puntoSeparatore = testoRimanente.indexOf('.', limite);
                if (puntoSeparatore === -1 || testoRimanente.length <= limite) {
                    puntoSeparatore = testoRimanente.length;
                } else {
                    puntoSeparatore = puntoSeparatore + 1;
                }

                let testoSeparatore = testoRimanente.substring(0, puntoSeparatore).trim();
                testoRimanente = testoRimanente.substring(puntoSeparatore).trim();

                if (testoSeparatore.length > 0) {
                    let sezioneSeparata = document.createElement("div");
                    sezioneSeparata.className = "article_text_block"; // Assegna questa classe per gestirla in CSS (width: 100%)
                    sezioneSeparata.textContent = testoSeparatore;
                    articleContainer.appendChild(sezioneSeparata);
                }
            }
        } 

        // 3. GESTIONE DEL TESTO IN ECCESSO (Se avanza testo dopo aver finito tutte le immagini)
        while (testoRimanente.length > 0) {
            let puntoFinale = testoRimanente.indexOf('.', limite);
            if (puntoFinale === -1 || testoRimanente.length <= limite) {
                puntoFinale = testoRimanente.length;
            } else {
                puntoFinale = puntoFinale + 1; 
            }

            let paragrafoExtra = testoRimanente.substring(0, puntoFinale).trim();
            testoRimanente = testoRimanente.substring(puntoFinale).trim();

            if (paragrafoExtra.length > 0) {
                let sezioneFinale = document.createElement("div");
                sezioneFinale.className = "article_text_block";
                sezioneFinale.textContent = paragrafoExtra;
                articleContainer.appendChild(sezioneFinale);
            }
        }

    } else { 
        // Caso standard: testo di qualsiasi lunghezza ma ZERO immagini
        let articleSection = document.createElement("div");
        articleSection.textContent = testoCompleto; 
        articleContainer.appendChild(articleSection);
    } 
}

window.addEventListener("DOMContentLoaded", initArticle);