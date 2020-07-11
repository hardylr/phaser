import {Emit, EventEmitter} from "../../events";
export class Keyboard extends EventEmitter {
  constructor() {
    super();
    this.keyConversion = {
      Up: "ArrowUp",
      Down: "ArrowDown",
      Left: "ArrowLeft",
      Right: "ArrowRight",
      Spacebar: " ",
      Win: "Meta",
      Scroll: "ScrollLock",
      Del: "Delete",
      Apps: "ContextMenu",
      Esc: "Escape",
      Add: "+",
      Subtract: "-",
      Multiply: "*",
      Decimal: ".",
      Divide: "/"
    };
    this.keydownHandler = (event) => this.onKeyDown(event);
    this.keyupHandler = (event) => this.onKeyUp(event);
    this.blurHandler = () => this.onBlur();
    window.addEventListener("keydown", this.keydownHandler);
    window.addEventListener("keyup", this.keyupHandler);
    window.addEventListener("blur", this.blurHandler);
    this.keys = new Map();
  }
  addKeys(...keys) {
    keys.forEach((key) => {
      this.keys.set(key.getValue(), key);
    });
  }
  clearKeys() {
    this.keys.clear();
  }
  onBlur() {
    this.keys.forEach((key) => {
      key.reset();
    });
  }
  getKeyValue(key) {
    if (this.keyConversion.hasOwnProperty(key)) {
      return this.keyConversion[key];
    } else {
      return key;
    }
  }
  onKeyDown(event) {
    const value = this.getKeyValue(event.key);
    if (this.keys.has(value)) {
      const key = this.keys.get(value);
      key.down(event);
    }
    Emit(this, "keydown-" + value, event);
    Emit(this, "keydown", event);
  }
  onKeyUp(event) {
    const value = this.getKeyValue(event.key);
    if (this.keys.has(value)) {
      const key = this.keys.get(value);
      key.up(event);
    }
    Emit(this, "keyup-" + value, event);
    Emit(this, "keyup", event);
  }
  destroy() {
    window.removeEventListener("keydown", this.keydownHandler);
    window.removeEventListener("keyup", this.keyupHandler);
    window.removeEventListener("blur", this.blurHandler);
    Emit(this, "destroy");
  }
}
