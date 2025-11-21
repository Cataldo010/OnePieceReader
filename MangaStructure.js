import { ReaderElement } from "./ReaderElement.js";
import { MangaList } from "./Manga.js";

class MangaStructure {
  constructor(volume, capitolo, pagina, img,titolo) {
      this.ElemVolume = new ReaderElement(volume);
      this.ElemCapitolo = new ReaderElement(capitolo);
      this.Pagina = 1;
      this.img = img;
      this.BasePath = `https://onepiecepower.com/manga8/onepiece/volumi/volume`;
      this.Titolo = titolo;
      this.onePieceMangaList = new MangaList();
      this.frame = document.getElementById("iframe");
  }
  nextPagina() {
    this.Pagina++;
  }
  prevPagina() {
    if (this.Pagina > 1) {
      this.Pagina--;
    }
  }
  setPagina(pagina) {
    this.Pagina = pagina;
  }
  PaginaPad() {
    return this.Pagina.toString().padStart(2, "0");
  }
  updateImg() {
    this.Titolo.textContent  = this.onePieceMangaList.getTitolo(this.ElemVolume.element.value, this.ElemCapitolo.element.value);
    var url =`${this.BasePath}${this.ElemVolume.getPad()}/${this.ElemCapitolo.getPad()}/${this.PaginaPad()}.jpg`
    this.img.src = url;
    this.saveToStorage();
  }
  saveToStorage() {
    const data = {
      volume: this.ElemVolume.get(),
      capitolo: this.ElemCapitolo.get(),
      pagina: this.Pagina,
      titolo: this.Titolo,
    };
    localStorage.setItem("onepiece_reader", JSON.stringify(data));
  }
}

function salvaStato(reader) {
  const data = {
    volume: reader.ElemVolume.get(),
    capitolo: reader.ElemCapitolo.get(),
    pagina: reader.Pagina,
  };
  localStorage.setItem("onepiece_reader", JSON.stringify(data));
}

function caricaStato() {
  const data = localStorage.getItem("onepiece_reader");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}
export { MangaStructure ,salvaStato, caricaStato};
