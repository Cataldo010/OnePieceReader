class OnePieceCapitolo {
    constructor(volume,capitolo, pagina, img ) {
      this.ElemVolume = new ReaderElement(volume);
      this.ElemCapitolo = new ReaderElement(capitolo);
      this.Pagina = 1;
      this.img = img;
      this.BasePath = `https://onepiecepower.com/manga8/onepiece/volumi/volume`;
    }

//    https://onepiecepower.com/manga8/onepiece/volumi/volume${volumeFormat}/${capitoloFormat}/01.jpg

    nextPagina(){
        this.Pagina++;
    }
    prevPagina(){
        if(this.Pagina > 1){
            this.Pagina--
        }
    }
    setPagina(pagina){
        this.Pagina = pagina
    }

    PaginaPad(){
        return this.Pagina.toString().padStart(2, "0");       
    }
    updateImg(){
        this.img.src = `${this.BasePath}${this.ElemVolume.getPad()}/${this.ElemCapitolo.getPad()}/${this.PaginaPad()}.jpg`;	
        this.saveToStorage();
    }

    saveToStorage() {
        const data = {
            volume: this.ElemVolume.get(),
            capitolo: this.ElemCapitolo.get(),
            pagina: this.Pagina
        };
        localStorage.setItem("onepiece_reader", JSON.stringify(data));
    }


}

class ReaderElement
{
    constructor(element) {
        this.element = element;
    }		
    getPad = () => {
        return this.element.value.toString().padStart(3, '0');
    }
    get(){
        return this.element.value;
    }
    set(value) {
        this.element.value = value;
    }
    prev(){
        if(this.element.value > 1){
            this.element.value--
        }
    }
    next(){
        this.element.value++;
    }
}
window.onload = function(){
    const volumeElem = document.getElementById("volume");
    const capitoloElem = document.getElementById("capitolo");
    const paginaElem = document.getElementById("pagina"); // non serve ma lo lasciamo per struttura
    const imgElem = document.getElementById("img");

    let reader = new OnePieceCapitolo(volumeElem, capitoloElem, paginaElem, imgElem);

    // Ripristina stato salvato
    const stato = caricaStato();
    if (stato) {
        reader.ElemVolume.set(stato.volume);
        reader.ElemCapitolo.set(stato.capitolo);
        reader.setPagina(parseInt(stato.pagina));
    }

    reader.updateImg();

    const aggiorna = () => {
        reader.updateImg();
        salvaStato(reader);
    }

    // Eventi
    document.getElementById("btn_PrevVolume").addEventListener("click", function() {
        reader.ElemVolume.prev();
        reader.setPagina(1);
        aggiorna();
    });
    document.getElementById("btn_NextVolume").addEventListener("click", function() {
        reader.ElemVolume.next();
        reader.setPagina(1);
        aggiorna();
    });
    document.getElementById("btn_PrevCapitolo").addEventListener("click", function() {
        reader.ElemCapitolo.prev();
        reader.setPagina(1);
        aggiorna();
    });
    document.getElementById("btn_NextCapitolo").addEventListener("click", function() {
        reader.ElemCapitolo.next();
        reader.setPagina(1);
        aggiorna();
    });
    document.getElementById("btn_PrevPagine").addEventListener("click", function() {
        reader.prevPagina();
        aggiorna();
    });
    document.getElementById("btn_NextPagine").addEventListener("click", function() {
        reader.nextPagina();
        aggiorna();
    });
}

function salvaStato(reader) {
    const data = {
        volume: reader.ElemVolume.get(),
        capitolo: reader.ElemCapitolo.get(),
        pagina: reader.Pagina
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
