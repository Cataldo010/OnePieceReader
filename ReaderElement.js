class ReaderElement {
  constructor(element) {
    this.element = element;
  }
  getPad() {
    return this.element.value.toString().padStart(3, "0");
  }
  get() {
    return this.element.valu;
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
export { ReaderElement };
