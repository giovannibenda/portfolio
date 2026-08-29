(() => {
    "use strict";
  
  
    /* ================================
       DATI
       ================================ */
  
    const repositories = [
  
      {
        name:"commerce",
        language:"Python / Django",
        description:"Auction platform sviluppata con Django.",
        url:"https://github.com/USERNAME/commerce"
      },
  
      {
        name:"mail",
        language:"JavaScript",
        description:"Single-page email client sviluppato per CS50W.",
        url:"https://github.com/USERNAME/mail"
      },
  
      {
        name:"wiki",
        language:"Python / Django",
        description:"Enciclopedia collaborativa basata su Markdown.",
        url:"https://github.com/USERNAME/wiki"
      },
  
      {
        name:"search",
        language:"HTML / CSS",
        description:"Replica delle interfacce Google Search.",
        url:"https://github.com/USERNAME/search"
      },
  
      {
        name:"finance",
        language:"Python",
        description:"Applicazione finanziaria per gestione portafoglio.",
        url:"https://github.com/USERNAME/finance"
      },
  
      {
        name:"creative-coding",
        language:"JavaScript",
        description:"Esperimenti audiovisivi e generativi.",
        url:"https://github.com/USERNAME/creative-coding"
      },
  
      {
        name:"supercollider",
        language:"SuperCollider",
        description:"Sintesi, DSP e sistemi generativi audio.",
        url:"https://github.com/USERNAME/supercollider"
      },
  
      {
        name:"csound",
        language:"Csound",
        description:"Esperimenti di sintesi ed elaborazione sonora.",
        url:"https://github.com/USERNAME/csound"
      },
  
      {
        name:"interactive-media",
        language:"JavaScript",
        description:"Sistemi interattivi, computer vision e multimedia.",
        url:"https://github.com/USERNAME/interactive-media"
      },
  
      {
        name:"portfolio",
        language:"HTML / CSS / JS",
        description:"Portfolio personale Web Development + Computer Music.",
        url:"https://github.com/USERNAME/portfolio"
      },
  
      {
        name:"audio-tools",
        language:"Python",
        description:"Utility sperimentali per analisi e manipolazione audio.",
        url:"https://github.com/USERNAME/audio-tools"
      },
  
      {
        name:"django-react-broker",
        language:"Django / React",
        description:"Applicazione SPA per analisi e gestione di strumenti finanziari.",
        url:"https://github.com/USERNAME/django-react-broker"
      }
  
    ];
  
  
    /* ================================
       CONFIGURAZIONE
       ================================ */
  
    const ITEMS_PER_PAGE = 5;
  
  
    /* ================================
       DOM
       ================================ */
  
    const track =
      document.getElementById("repoTrack");
  
    const prev =
      document.getElementById("repoPrev");
  
    const next =
      document.getElementById("repoNext");
  
    const pagination =
      document.getElementById("repoPagination");
  
    const repoCounter =
      document.getElementById("repoCounter");
  
    const errorBox =
      document.getElementById("repoError");
  
  
    if(
      !track ||
      !prev ||
      !next ||
      !pagination
    ){
      return;
    }
  
  
    /* ================================
       STATO
       ================================ */
  
    let currentPage = 0;
  
  
    const totalPages =
      Math.ceil(
        repositories.length /
        ITEMS_PER_PAGE
      );
  
  
    /* ================================
       CREA RIGA
       ================================ */
  
    function createRepositoryRow(
      repository,
      absoluteIndex
    ){
  
      const row =
        document.createElement("a");
  
  
      row.className =
        "repo-row";
  
  
      row.href =
        repository.url;
  
  
      row.target =
        "_blank";
  
  
      row.rel =
        "noopener noreferrer";
  
  
      /*
        Numero
      */
  
      const index =
        document.createElement("span");
  
      index.className =
        "repo-index";
  
      index.textContent =
        String(
          absoluteIndex + 1
        ).padStart(2,"0");
  
  
      /*
        Nome
      */
  
      const name =
        document.createElement("span");
  
      name.className =
        "repo-name";
  
      name.textContent =
        repository.name;
  
  
      /*
        Linguaggio
      */
  
      const language =
        document.createElement("span");
  
      language.className =
        "repo-language";
  
      language.textContent =
        repository.language;
  
  
      /*
        Descrizione
      */
  
      const description =
        document.createElement("span");
  
      description.className =
        "repo-description";
  
      description.textContent =
        repository.description;
  
  
      /*
        Freccia
      */
  
      const arrow =
        document.createElement("span");
  
      arrow.className =
        "repo-arrow";
  
      arrow.textContent =
        "↗";
  
  
      row.append(
        index,
        name,
        language,
        description,
        arrow
      );
  
  
      return row;
    }
  
  
    /* ================================
       CREA PAGINA
       ================================ */
  
    function renderPage(){
  
      track.innerHTML = "";
  
  
      const start =
        currentPage *
        ITEMS_PER_PAGE;
  
  
      const end =
        Math.min(
          start + ITEMS_PER_PAGE,
          repositories.length
        );
  
  
      const page =
        document.createElement("div");
  
      page.className =
        "repo-page";
  
  
      for(
        let i = start;
        i < end;
        i++
      ){
  
        page.appendChild(
          createRepositoryRow(
            repositories[i],
            i
          )
        );
  
      }
  
  
      track.appendChild(page);
  
  
      updateControls();
      updateCounter();
    }
  
  
    /* ================================
       PAGINAZIONE
       ================================ */
  
    function buildPagination(){
  
      pagination.innerHTML = "";
  
  
      for(
        let i = 0;
        i < totalPages;
        i++
      ){
  
        const dot =
          document.createElement("button");
  
  
        dot.type =
          "button";
  
  
        dot.className =
          "repo-dot";
  
  
        dot.setAttribute(
          "aria-label",
          `Vai alla pagina ${i + 1}`
        );
  
  
        dot.addEventListener(
          "click",
          () => {
  
            currentPage = i;
  
            renderPage();
  
          }
        );
  
  
        pagination.appendChild(dot);
      }
  
    }
  
  
    /* ================================
       AGGIORNA CONTROLLI
       ================================ */
  
    function updateControls(){
  
      prev.disabled =
        currentPage === 0;
  
  
      next.disabled =
        currentPage ===
        totalPages - 1;
  
  
      const dots =
        pagination.querySelectorAll(
          ".repo-dot"
        );
  
  
      dots.forEach(
        (dot,index) => {
  
          dot.classList.toggle(
            "active",
            index === currentPage
          );
  
  
          dot.setAttribute(
            "aria-current",
            index === currentPage
              ? "page"
              : "false"
          );
  
        }
      );
  
    }
  
  
    /* ================================
       COUNTER
       mantenuto anche se nascosto
       ================================ */
  
    function updateCounter(){
  
      if(!repoCounter){
        return;
      }
  
  
      repoCounter.textContent =
        `${currentPage + 1}/${totalPages}`;
  
    }
  
  
    /* ================================
       FRECCE
       ================================ */
  
    prev.addEventListener(
      "click",
      () => {
  
        if(currentPage <= 0){
          return;
        }
  
  
        currentPage--;
  
        renderPage();
  
      }
    );
  
  
    next.addEventListener(
      "click",
      () => {
  
        if(
          currentPage >=
          totalPages - 1
        ){
          return;
        }
  
  
        currentPage++;
  
        renderPage();
  
      }
    );
  
  
    /* ================================
       TASTIERA
       ================================ */
  
    document.addEventListener(
      "keydown",
      event => {
  
        /*
          Evitiamo di rubare i tasti
          quando l'utente sta scrivendo.
        */
  
        const tag =
          document.activeElement
            ?.tagName
            ?.toLowerCase();
  
  
        if(
          tag === "input" ||
          tag === "textarea"
        ){
          return;
        }
  
  
        if(
          event.key ===
          "ArrowLeft"
        ){
  
          prev.click();
  
        }
  
  
        if(
          event.key ===
          "ArrowRight"
        ){
  
          next.click();
  
        }
  
      }
    );
  
  
    /* ================================
       AVVIO
       ================================ */
  
    try{
  
      buildPagination();
  
      renderPage();
  
    }catch(error){
  
      console.error(
        "Repository carousel:",
        error
      );
  
  
      if(errorBox){
  
        errorBox.style.display =
          "block";
  
  
        errorBox.textContent =
          "Impossibile caricare le repository.";
  
      }
  
    }
  
  })();