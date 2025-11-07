import { MangaStructure } from "./MangaStructure.js";
import { salvaStato, caricaStato } from "./MangaStructure.js";

window.onload = function () {
  const volumeElem = document.getElementById("volume");
  const capitoloElem = document.getElementById("capitolo");
  const paginaElem = document.createElement("input");
  const imgElem = document.getElementById("img");
  const titolo = document.getElementById("titolo");

  let reader = new MangaStructure(
    volumeElem,
    capitoloElem,
    paginaElem,
    imgElem,
    titolo
  );

  const stato = caricaStato();
  if (stato) {
    if(stato.volume){
      reader.ElemVolume.set(stato.volume);
    }else{
      reader.ElemVolume.set(reader.onePieceMangaList.getLast().Volume);
    }
    if( stato.capitolo){
      reader.ElemCapitolo.set(stato.capitolo);
    }else{
      reader.ElemCapitolo.set(reader.onePieceMangaList.getLast().Capitolo);
    }
    reader.setPagina(parseInt(stato.pagina));
  }

  reader.updateImg();

  const aggiorna = () => {
    reader.updateImg();
    salvaStato(reader);
  };

  document
    .getElementById("btn_PrevVolume")
    .addEventListener("click", function () {
      reader.ElemVolume.prev();
      reader.setPagina(1);
      aggiorna();
    });
  document
    .getElementById("btn_NextVolume")
    .addEventListener("click", function () {
      reader.ElemVolume.next();
      reader.setPagina(1);
      aggiorna();
    });
  document
    .getElementById("btn_PrevCapitolo")
    .addEventListener("click", function () {
      reader.ElemCapitolo.prev();
      reader.setPagina(1);
      aggiorna();
    });
  document
    .getElementById("btn_NextCapitolo")
    .addEventListener("click", function () {
      reader.ElemCapitolo.next();
      reader.setPagina(1);
      aggiorna();
    });
  document
    .getElementById("btn_PrevPagine")
    .addEventListener("click", function () {
      reader.prevPagina();
      aggiorna();
    });
  document
    .getElementById("btn_NextPagine")
    .addEventListener("click", function () {
      reader.nextPagina();
      aggiorna();
    });
  document.getElementById("btn_go").addEventListener("click", function () {
    aggiorna();
  });

  const drawer = document.getElementById("drawer");
  const overlay = document.getElementById("overlay");
  document.getElementById("btn_drawer").addEventListener("click", () => {
    drawer.classList.toggle("-translate-x-full");
    overlay.classList.toggle("hidden");
  });
  overlay.addEventListener("click", () => {
    drawer.classList.add("-translate-x-full");
    overlay.classList.add("hidden");
  });

 document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft")
      document.getElementById("btn_PrevPagine").click();
    if (e.key === "ArrowRight")
      document.getElementById("btn_NextPagine").click();
  });
};
