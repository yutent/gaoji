/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import $ from "../utils.js"
import "./radio-item.js"

export default class Radio extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["value"]
  }

  props = {
    value: null
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
  display: inline-flex; }
</style>
  <slot />
`
      
  }

  _updateChildrenStat() {
    Array.from(this.children).forEach(it => {
      if (it.tagName === 'WC-RADIO-ITEM' && it.root) {
        if (it.value === this.props.value) {
          it.checked = true
        } else {
          it.checked = false
        }
      }
    })
  }

  get value() {
    return this.props.value
  }

  set value(val) {
    if (val === this.props.value) {
      return
    }
    this.props.value = val
    this._updateChildrenStat()
  }

  connectedCallback() {
    this._pickedFn = $.bind(this, 'child-picked', ev => {
      log('radio picked: ', ev.detail)
      this.value = ev.detail
      this.dispatchEvent(new CustomEvent('input'))
    })
  }

  disconnectedCallback() {
    $.unbind(this, 'child-picked', this._pickedFn)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'value':
        this.value = val
        break
    }
  }
}


if(!customElements.get('wc-radio')){
  customElements.define('wc-radio', Radio)
}
