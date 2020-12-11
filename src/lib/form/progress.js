/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


export default class Progress extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["value","max"]
  }

  props = {
    value: 0,
    max: 1
  }
  

  constructor() {
    super();
    
    Object.defineProperty(this, 'root', {
      value: this.attachShadow({ mode: 'open' }),
      writable: true,
      enumerable: false,
      configurable: true
    })

    this.root.innerHTML = `<style>* {
  box-sizing: border-box;
  margin: 0;
  padding: 0; }

::before,
::after {
  box-sizing: border-box; }

:host {
  --color-teal-1: #4db6ac;
  --color-teal-2: #26a69a;
  --color-teal-3: #009688;
  --color-green-1: #81c784;
  --color-green-2: #66bb6a;
  --color-green-3: #4caf50;
  --color-purple-1: #9575cd;
  --color-purple-2: #9575cd;
  --color-purple-3: #673ab7;
  --color-blue-1: #64b5f6;
  --color-blue-2: #42a5f5;
  --color-blue-3: #2196f3;
  --color-red-1: #ff5061;
  --color-red-2: #eb3b48;
  --color-red-3: #ce3742;
  --color-orange-1: #ffb618;
  --color-orange-2: #f39c12;
  --color-orange-3: #e67e22;
  --color-plain-1: #f2f5fc;
  --color-plain-2: #e8ebf4;
  --color-plain-3: #dae1e9;
  --color-grey-1: #bdbdbd;
  --color-grey-2: #9e9e9e;
  --color-grey-3: #757575;
  --color-dark-1: #62778d;
  --color-dark-2: #526273;
  --color-dark-3: #425064; }

:host {
  display: flex;
  align-items: center; }
  :host label {
    flex: 1;
    height: var(--size, 10px);
    border-radius: 9px;
    background: var(--color-plain-2); }
    :host label span {
      display: block;
      width: 0;
      height: 100%;
      border-radius: 9px;
      background: var(--color-teal-1); }

:host([size='large']) label {
  height: 18px; }

:host([size='medium']) label {
  height: 14px; }

:host([size='mini']) label {
  height: 6px; }

:host([color='red']) label span {
  background: var(--color-red-1); }

:host([color='blue']) label span {
  background: var(--color-blue-1); }

:host([color='green']) label span {
  background: var(--color-green-1); }

:host([color='orange']) label span {
  background: var(--color-orange-1); }

:host([color='dark']) label span {
  background: var(--color-dark-1); }

:host([color='purple']) label span {
  background: var(--color-purple-1); }
</style>
  <label><span></span></label>
`
      
    this.__THUMB__ = this.root.children[1].lastElementChild
  }

  get value() {
    return this.props.value
  }

  set value(val) {
    this.props.value = +val
    this.calculate()
  }

  calculate() {
    var { max, value } = this.props
    this.__THUMB__.style.width = `${(100 * value) / max}%`
  }

  connectedCallback() {
    this.calculate()
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'max':
        var max = +val
        if (max !== max || max < 1) {
          max = 1
        }
        this.props.max = max
        this.calculate()
        break

      case 'value':
        var v = +val
        if (v === v) {
          this.props.value = v
          this.calculate()
        }
        break
    }
  }
}


if(!customElements.get('wc-progress')){
  customElements.define('wc-progress', Progress)
}
