/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import $ from "../utils.js"
export default class Switch extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["'active-text'","'inactive-text'","checked","disabled"]
  }

  props = {
    'active-text': null,
    'inactive-text': null,
    checked: false,
    disabled: false
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
  display: inline-block; }
  :host section {
    display: flex;
    justify-content: center;
    align-items: center;
    line-height: 0;
    white-space: nowrap; }
  :host label {
    display: flex;
    align-items: center;
    width: 32px;
    height: 18px;
    padding: 3px;
    margin: 5px;
    border-radius: 21px;
    background: var(--color-plain-3);
    cursor: inherit; }
    :host label.checked {
      flex-direction: row-reverse;
      background: var(--color-grey-3); }
  :host .dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #fff; }

:host([disabled]) {
  cursor: not-allowed;
  opacity: 0.6; }

:host([size='large']) label {
  width: 46px;
  height: 26px;
  padding: 3px 5px; }

:host([size='large']) .dot {
  width: 18px;
  height: 18px; }

:host([size='medium']) label {
  width: 38px;
  height: 22px;
  padding: 3px 4px; }

:host([size='medium']) .dot {
  width: 16px;
  height: 16px; }

:host([size='mini']) label {
  width: 22px;
  height: 14px;
  padding: 2px; }

:host([size='mini']) .dot {
  width: 10px;
  height: 10px; }

:host([color='red']) label.checked {
  background: var(--color-red-1); }

:host([color='blue']) label.checked {
  background: var(--color-blue-1); }

:host([color='green']) label.checked {
  background: var(--color-green-1); }

:host([color='teal']) label.checked {
  background: var(--color-teal-1); }

:host([color='orange']) label.checked {
  background: var(--color-orange-1); }

:host([color='dark']) label.checked {
  background: var(--color-dark-1); }

:host([color='purple']) label.checked {
  background: var(--color-purple-1); }
</style>
  <section>
    <label>
      <span class="dot"></span>
    </label>
    <slot></slot>
  </section>
`
      

    this.__SWITCH__ = this.root.lastElementChild.firstElementChild
  }

  get value() {
    return this.props.checked
  }

  set value(val) {
    this.checked = val
  }

  get checked() {
    return this.props.checked
  }

  set checked(val) {
    this.props.checked = !!val
    this.__SWITCH__.classList.toggle('checked', this.props.checked)
  }

  get disabled() {
    return this.props.disabled
  }

  set disabled(val) {
    var type = typeof val

    if (val === this.props.disabled) {
      return
    }
    if ((type === 'boolean' && val) || type !== 'boolean') {
      this.props.disabled = true
      this.setAttribute('disabled', '')
    } else {
      this.props.disabled = false
      this.removeAttribute('disabled')
    }
  }

  connectedCallback() {
    this._handleClick = $.bind(this, 'click', ev => {
      if (this.disabled) {
        return
      }
      this.checked = !this.checked
      if (this.checked) {
        if (this.props['active-text'] !== null) {
          this.textContent = this.props['active-text']
        }
      } else {
        if (this.props['inactive-text'] !== null) {
          this.textContent = this.props['inactive-text']
        }
      }
      this.dispatchEvent(new CustomEvent('input'))
    })
  }

  disconnectedCallback() {
    $.unbind(this, 'click', this._handleClick)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'checked':
      case 'disabled':
        this[name] = true
        break
      case 'active-text':
      case 'inactive-text':
        this.props[name] = val + ''
        break
    }
  }
}


if(!customElements.get('wc-switch')){
  customElements.define('wc-switch', Switch)
}
