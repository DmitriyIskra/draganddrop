export default class Cursor {
  constructor() {
    this.grabbing = 'grabbing';
    this.pointer = 'pointer';
  }

  changeCursor(element, type) {
    if (type === 'mousedown') {
        console.log(element)
        element.style.cursor = this.grabbing
    };

    if (type === 'mouseup') element.style.cursor = this.pointer;
  }
}
