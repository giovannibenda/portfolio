(() => {
    "use strict";
  
    const base = document.getElementById("complexWave");
  
    if (!base) return;
  
  
    /*
      Il canvas originale viene lasciato nel DOM
      ma nascosto.
  
      Creiamo un solo canvas realmente visibile.
    */
  
    base.style.visibility = "hidden";
    base.style.opacity = "0";
  
  
    const host = base.parentElement;
  
    if (!host) return;
  
  
    /*
      Evita duplicazioni se lo script
      viene caricato più di una volta.
    */
  
    let canvas =
      document.getElementById("zoomedSineScope");
  
  
    if (!canvas){
  
      canvas =
        document.createElement("canvas");
  
      canvas.id = "zoomedSineScope";
  
      host.appendChild(canvas);
  
    }
  
  
    const ctx =
      canvas.getContext(
        "2d",
        {
          alpha:false
        }
      );
  
  
    if (!ctx) return;
  
  
    ctx.imageSmoothingEnabled = false;
  
  
    /*
      Stato del segnale
    */
  
    let phase = 0;
  
    let time = 0;
  
    let previousWidth = 0;
    let previousHeight = 0;
  
  
    /*
      Resize canvas ad alta definizione
    */
  
    function resizeCanvas(){
  
      const rect =
        host.getBoundingClientRect();
  
      const cssWidth =
        Math.max(
          1,
          rect.width
        );
  
      const cssHeight =
        window.innerWidth <= 620
          ? 90
          : 110;
  
  
      const dpr =
        Math.min(
          window.devicePixelRatio || 1,
          2
        );
  
  
      const realWidth =
        Math.floor(
          cssWidth * dpr
        );
  
      const realHeight =
        Math.floor(
          cssHeight * dpr
        );
  
  
      if(
        realWidth === previousWidth &&
        realHeight === previousHeight
      ){
        return;
      }
  
  
      previousWidth = realWidth;
      previousHeight = realHeight;
  
  
      canvas.width = realWidth;
      canvas.height = realHeight;
  
      canvas.style.width =
        cssWidth + "px";
  
      canvas.style.height =
        cssHeight + "px";
  
  
      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
  
  
      ctx.imageSmoothingEnabled = false;
  
    }
  
  
    /*
      Pseudo-random deterministico.
  
      Serve per rendere il segnale
      irregolare senza creare rumore
      completamente casuale a ogni frame.
    */
  
    function pseudoNoise(value){
  
      return (
        Math.sin(
          value * 12.9898
        ) * 43758.5453
      ) % 1;
  
    }
  
  
    /*
      Generazione del campione.
  
      Il segnale combina:
      - sinusoidale principale
      - modulazione FM
      - armoniche
      - piccole discontinuità
      - rumore pseudo casuale
    */
  
  function signalSample(x){
  
      const carrier =
      Math.sin(
          x * 5.5 +
          phase
      );
  
      const modulation =
      Math.sin(
          x * 0.0022 -
          phase * .4
      );
  
      const harmonic =
      Math.sin(
          x * 0.014 +
          phase * .05
      );
  
      const highFrequency =
      Math.sin(
          x * 0.32 -
          phase * .4
      );
  
      const irregular =
      pseudoNoise(
          x * .18 +
          time
      );
  
  
      let value =
  
      Math.sin(
          x * 0.0055 +
          phase +
          modulation * .35
      ) * .2
  
      +
  
      carrier * .0084
  
      +
  
      harmonic * .003
  
      +
  
      highFrequency * .005
  
      +
  
      irregular * .04;
  
  
      return value;
  }
  
  
    /*
      Disegna waveform
    */
  
    function draw(){
  
      resizeCanvas();
  
  
      const width =
        canvas.clientWidth;
  
      const height =
        canvas.clientHeight;
  
  
      /*
        Sfondo bianco
      */
  
      ctx.fillStyle = "#ffffff";
  
      ctx.fillRect(
        0,
        0,
        width,
        height
      );
  
  
      /*
        Centro verticale
      */
  
      const centerY =
        height * .5;
  
  
      /*
        Altezza massima waveform
      */
  
      const amplitude =
        height * .5;
  
  
      /*
        Disegno waveform
      */
  
      ctx.beginPath();
  
  
      ctx.strokeStyle =
        "#012169";
  
      ctx.lineWidth = 1.15;
  
      ctx.lineJoin = "miter";
      ctx.lineCap = "square";
  
  
      /*
        Step piccolo =
        waveform molto fitta / oscilloscope
      */
  
      const step = 5;
  
  
      for(
        let x = 0;
        x <= width;
        x += step
      ){
  
        /*
          Il segnale viene letto al contrario:
          dà l'impressione che arrivi
          da destra e scorra verso sinistra.
        */
  
        const sourceX =
          width - x +
          time * 160;
  
  
        const sample =
          signalSample(
            sourceX
          );
  
  
        const y =
          centerY +
          sample * amplitude;
  
  
        if(x === 0){
  
          ctx.moveTo(
            x,
            y
          );
  
        }else{
  
          ctx.lineTo(
            x,
            y
          );
  
        }
  
      }
  
  
      ctx.stroke();
  
  
      /*
        Movimento molto rapido
      */
  
      phase += .15;
  
      time += .0045;
  
  
      requestAnimationFrame(draw);
  
    }
  
  
    /*
      Avvio
    */
  
    resizeCanvas();
  
    requestAnimationFrame(draw);
  
  
    /*
      Resize browser
    */
  
    let resizeTimer;
  
  
    window.addEventListener(
      "resize",
      () => {
  
        clearTimeout(
          resizeTimer
        );
  
  
        resizeTimer =
          setTimeout(
            resizeCanvas,
            80
          );
  
      }
    );
  
  })();