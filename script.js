class ReaderElement {
      constructor(element) {
        this.element = element;
      }
      getPad() {
        return this.element.value.toString().padStart(3, '0');
      }
      get() {
        return this.element.value;
      }
      set(value) {
        this.element.value = value;
      }
      prev() {
        if (this.element.value > 1) {
          this.element.value--;
        }
      }
      next() {
        this.element.value++;
      }
    }

    class OnePieceCapitolo {
      constructor(volume, capitolo, pagina, img) {
        this.ElemVolume = new ReaderElement(volume);
        this.ElemCapitolo = new ReaderElement(capitolo);
        this.Pagina = 1;
        this.img = img;
        this.BasePath = `https://onepiecepower.com/manga8/onepiece/volumi/volume`;
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

    window.onload = function () {
      const volumeElem = document.getElementById("volume");
      const capitoloElem = document.getElementById("capitolo");
      const paginaElem = document.createElement("input");
      const imgElem = document.getElementById("img");

      let reader = new OnePieceCapitolo(volumeElem, capitoloElem, paginaElem, imgElem);

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
      };

      document.getElementById("btn_PrevVolume").addEventListener("click", function () {
        reader.ElemVolume.prev();
        reader.setPagina(1);
        aggiorna();
      });
      document.getElementById("btn_NextVolume").addEventListener("click", function () {
        reader.ElemVolume.next();
        reader.setPagina(1);
        aggiorna();
      });
      document.getElementById("btn_PrevCapitolo").addEventListener("click", function () {
        reader.ElemCapitolo.prev();
        reader.setPagina(1);
        aggiorna();
      });
      document.getElementById("btn_NextCapitolo").addEventListener("click", function () {
        reader.ElemCapitolo.next();
        reader.setPagina(1);
        aggiorna();
      });
      document.getElementById("btn_PrevPagine").addEventListener("click", function () {
        reader.prevPagina();
        aggiorna();
      });
      document.getElementById("btn_NextPagine").addEventListener("click", function () {
        reader.nextPagina();
        aggiorna();
      });
      document.getElementById("btn_go").addEventListener("click", function () {
        aggiorna();
      });

      document.getElementById('btn_toggle_mode').addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
      });

      const drawer = document.getElementById('drawer');
      const overlay = document.getElementById('overlay');
      document.getElementById('btn_drawer').addEventListener('click', () => {
        drawer.classList.toggle('-translate-x-full');
        overlay.classList.toggle('hidden');
      });
      overlay.addEventListener('click', () => {
        drawer.classList.add('-translate-x-full');
        overlay.classList.add('hidden');
      });

      let scale = 1;
      let originX = 0;
      let originY = 0;

      imgElem.addEventListener('wheel', (e) => {
        e.preventDefault();
        const rect = imgElem.getBoundingClientRect();
        originX = ((e.clientX - rect.left) / rect.width) * 100;
        originY = ((e.clientY - rect.top) / rect.height) * 100;
        scale += e.deltaY * -0.001;
        scale = Math.min(Math.max(0.5, scale), 3);
        imgElem.style.transformOrigin = `${originX}% ${originY}%`;
        imgElem.style.transform = `scale(${scale})`;
      });

      let isDragging = false;
      let startX, startY;
      let currentX = 0, currentY = 0;

      imgElem.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - currentX;
        startY = e.clientY - currentY;
      });

      document.addEventListener('mouseup', () => {
        isDragging = false;
      });

      document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX - startX;
        currentY = e.clientY - startY;
        imgElem.style.left = `${currentX}px`;
        imgElem.style.top = `${currentY}px`;
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') document.getElementById('btn_PrevPagine').click();
        if (e.key === 'ArrowRight') document.getElementById('btn_NextPagine').click();
      });
    };
