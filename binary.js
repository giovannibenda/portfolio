(() => {
    "use strict";
  
    const binaryEl = document.getElementById("binaryStream");
  
    if (!binaryEl) return;
  
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
  
    let counter = 0 >>> 0;
  
    function bits32(value){
      return (value >>> 0)
        .toString(2)
        .padStart(32, "0");
    }
  
  
    function rotateLeft32(value, amount){
      amount &= 31;
  
      return (
        (value << amount) |
        (value >>> (32 - amount))
      ) >>> 0;
    }
  
  
    function makeBinaryBlock(seed, blocks){
      const output = [];
  
      for(let i = 0; i < blocks; i++){
  
        const mixed = (
          Math.imul(
            (seed + i * 0x9e3779b9) >>> 0,
            0x85ebca6b
          )
  
          ^
  
          rotateLeft32(
            seed ^ (i * 0x27d4eb2d),
            (i * 7 + counter) & 31
          )
  
          ^
  
          (counter >>> (i % 13))
  
        ) >>> 0;
  
        output.push(bits32(mixed));
      }
  
      return output.join("");
    }
  
  
    function getVisibleCharacterCount(){
  
      /*
        Stima della larghezza media di un carattere.
  
        Serve per generare SOLO la quantità di bit
        necessaria a riempire il contenitore.
      */
  
      const pxPerCharacter =
        window.innerWidth < 620
          ? 6.2
          : 9;
  
      const width = binaryEl.clientWidth;
  
      return Math.max(
        72,
        Math.ceil(width / pxPerCharacter)
      );
    }
  
  
    function renderBinary(){
  
      counter = (counter + 1) >>> 0;
  
      const chars = getVisibleCharacterCount();
  
      const blocks = Math.max(
        4,
        Math.ceil(chars / 32) + 2
      );
  
      /*
        Gray code:
        produce variazioni meno lineari
        rispetto a un semplice contatore.
      */
  
      const gray =
        (counter ^ (counter >>> 1)) >>> 0;
  
  
      const stream =
        bits32(counter)
  
        +
  
        makeBinaryBlock(
          counter ^ 0xa5a5a5a5,
          blocks
        )
  
        +
  
        bits32(gray)
  
        +
  
        makeBinaryBlock(
          gray ^ 0x5a5a5a5a,
          blocks
        )
  
        +
  
        bits32(
          rotateLeft32(counter, 11)
        )
  
        +
  
        makeBinaryBlock(
          counter ^ 0x0f0ff0f0,
          blocks
        );
  
  
      binaryEl.textContent =
        stream.slice(0, chars);
    }
  
  
    /*
      Prima visualizzazione immediata
    */
  
    renderBinary();
  
  
    /*
      Aggiornamento rapido.
      85 ms ≈ 11.7 aggiornamenti al secondo.
    */
  
    if(!reduceMotion){
  
      setInterval(
        renderBinary,
        85
      );
  
    }
  
  
    /*
      Quando cambia larghezza browser,
      ricalcola il numero corretto di bit.
    */
  
    let resizeTimer;
  
    window.addEventListener(
      "resize",
      () => {
  
        clearTimeout(resizeTimer);
  
        resizeTimer = setTimeout(
          renderBinary,
          100
        );
  
      }
    );
  
  })();