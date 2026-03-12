import { MangaStructure } from "./MangaStructure.js";
import { salvaStato, caricaStato } from "./MangaStructure.js";

window.onload = function () {

  const volumeElem = document.getElementById("volume");
  const capitoloElem = document.getElementById("capitolo");
  const paginaElem = document.createElement("input");
  const imgElem = document.getElementById("img");
  const titolo = document.getElementById("titolo");
  const lens = document.getElementById("magnifier");
  /* -------------------- MAGNIFIER STYLE -------------------- */
  
  lens.style.position = "absolute";
  lens.style.width = "400px";
  lens.style.height = "400px";
  lens.style.border = "2px solid white";
  lens.style.pointerEvents = "none";
  lens.style.backgroundRepeat = "no-repeat";
  lens.style.zIndex = "1000";

  imgElem.parentElement.style.position = "relative";
  /* -------------------- READER -------------------- */

  let reader = new MangaStructure(
    volumeElem,
    capitoloElem,
    paginaElem,
    imgElem,
    titolo
  );

  const stato = caricaStato();

  if (stato) {

    if (stato.volume) {
      reader.ElemVolume.set(stato.volume);
    } else {
      reader.ElemVolume.set(reader.onePieceMangaList.getLast().Volume);
    }

    if (stato.capitolo) {
      reader.ElemCapitolo.set(stato.capitolo);
    } else {
      reader.ElemCapitolo.set(reader.onePieceMangaList.getLast().Capitolo);
    }

    reader.setPagina(parseInt(stato.pagina));
  }

  reader.updateImg();

  const aggiorna = () => {
    reader.updateImg();
    salvaStato(reader);
  };

  /* -------------------- BOTTONI -------------------- */

  document.getElementById("btn_PrevVolume").onclick = () => {
    reader.ElemVolume.prev();
    reader.setPagina(1);
    aggiorna();
  };

  document.getElementById("btn_NextVolume").onclick = () => {
    reader.ElemVolume.next();
    reader.setPagina(1);
    aggiorna();
  };

  document.getElementById("btn_PrevCapitolo").onclick = () => {
    reader.ElemCapitolo.prev();
    reader.setPagina(1);
    aggiorna();
  };

  document.getElementById("btn_NextCapitolo").onclick = () => {
    reader.ElemCapitolo.next();
    reader.setPagina(1);
    aggiorna();
  };

  document.getElementById("btn_PrevPagine").onclick = () => {
    reader.prevPagina();
    aggiorna();
  };

  document.getElementById("btn_NextPagine").onclick = () => {
    reader.nextPagina();
    aggiorna();
  };

  document.getElementById("btn_go").onclick = () => {
    aggiorna();
  };

  /* -------------------- DRAWER -------------------- */

  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");

  document.getElementById("btn_drawer").onclick = () => {
    drawer.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  };

  overlay.onclick = () => {
    drawer.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  };

  /* -------------------- ZOOM CON ROTELLA -------------------- */

  let scale = 1;
  let originX = 0;
  let originY = 0;

  imgElem.addEventListener("wheel", (e) => {

    e.preventDefault();

    const rect = imgElem.getBoundingClientRect();

    originX = ((e.clientX - rect.left) / rect.width) * 100;
    originY = ((e.clientY - rect.top) / rect.height) * 100;

    scale += e.deltaY * -0.001;

    scale = Math.min(Math.max(0.5, scale), 3);

    imgElem.style.transformOrigin = `${originX}% ${originY}%`;
    imgElem.style.transform = `scale(${scale})`;

  });

  /* -------------------- DRAG IMMAGINE -------------------- */

  let isDragging = false;
  let startX, startY;
  let currentX = 0;
  let currentY = 0;

  imgElem.addEventListener("mousedown", (e) => {

    isDragging = true;

    startX = e.clientX - currentX;
    startY = e.clientY - currentY;

  });

  document.addEventListener("mouseup", () => {
    isDragging = false;
  });

  document.addEventListener("mousemove", (e) => {

    if (!isDragging) return;

    currentX = e.clientX - startX;
    currentY = e.clientY - startY;

    imgElem.style.left = `${currentX}px`;
    imgElem.style.top = `${currentY}px`;

  });

  /* -------------------- TASTI FRECCIA -------------------- */

  document.addEventListener("keydown", (e) => {

    if (e.key === "ArrowLeft") {
      document.getElementById("btn_PrevPagine").click();
    }

    if (e.key === "ArrowRight") {
      document.getElementById("btn_NextPagine").click();
    }

  });

  /* -------------------- MAGNIFIER -------------------- */

  imgElem.addEventListener("mouseenter", () => {

    lens.style.display = "block";
    lens.style.backgroundImage = `url(${imgElem.src})`;

  });

  imgElem.addEventListener("mouseleave", () => {

    lens.style.display = "none";

  });

  imgElem.addEventListener("mousemove", moveLens);

};

/* -------------------- MOVE LENS -------------------- */


function moveLens(e) {
  const img = document.getElementById("img");
  const lens = document.getElementById("magnifier");

  const rect = img.getBoundingClientRect();

  let x = e.clientX - rect.left;
  let y = e.clientY - rect.top;

  const lensSize = lens.offsetWidth / 2;

  x = x - lensSize;
  y = y - lensSize;

  lens.style.left = x + "px";
  lens.style.top = y + "px";

  const zoom = 2;

  lens.style.backgroundImage = `url(${img.src})`;

  lens.style.backgroundSize =
    img.width * zoom + "px " + img.height * zoom + "px";

  lens.style.backgroundPosition =
    "-" + (x * zoom) + "px -" + (y * zoom) + "px";
}