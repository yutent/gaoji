/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import $ from "../utils.js"

export default class RadioItem extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["value","checked","readonly","disabled"]
  }

  props = {
    value: '',
    checked: false,
    readonly: false,
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
  display: inline-flex;
  line-height: 1;
  font-size: 14px; }
  :host label {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 32px;
    height: 32px;
    padding: 0 5px;
    line-height: 1;
    -moz-user-select: none;
    user-select: none;
    white-space: nowrap;
    cursor: inherit;
    color: var(--color-grey-3); }
    :host label.checked .dot::after {
      visibility: visible; }
  :host .dot {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 18px;
    height: 18px;
    margin-right: 3px;
    border: 1px solid var(--color-grey-1);
    border-radius: 50%;
    background: #fff; }
    :host .dot::after {
      display: block;
      visibility: hidden;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--color-grey-1);
      content: ''; }

:host([readonly]) {
  opacity: 0.8; }

:host([disabled]) {
  cursor: not-allowed;
  opacity: 0.6; }

:host([size='large']) label {
  min-width: 58px;
  height: 32px; }

:host([size='large']) .dot {
  width: 26px;
  height: 26px; }
  :host([size='large']) .dot::after {
    width: 18px;
    height: 18px; }

:host([size='medium']) label {
  min-width: 50px;
  height: 28px; }

:host([size='medium']) .dot {
  width: 22px;
  height: 22px; }
  :host([size='medium']) .dot::after {
    width: 14px;
    height: 14px; }

:host([size='mini']) label {
  height: 14px; }

:host([size='mini']) .dot {
  width: 14px;
  height: 14px; }
  :host([size='mini']) .dot::after {
    width: 8px;
    height: 8px; }

:host([color='red']) label.checked {
  color: var(--color-red-1); }
  :host([color='red']) label.checked .dot {
    border-color: var(--color-red-1); }
  :host([color='red']) label.checked .dot::after {
    background: var(--color-red-1); }

:host([color='blue']) label.checked {
  color: var(--color-blue-1); }
  :host([color='blue']) label.checked .dot {
    border-color: var(--color-blue-1); }
  :host([color='blue']) label.checked .dot::after {
    background: var(--color-blue-1); }

:host([color='green']) label.checked {
  color: var(--color-green-1); }
  :host([color='green']) label.checked .dot {
    border-color: var(--color-green-1); }
  :host([color='green']) label.checked .dot::after {
    background: var(--color-green-1); }

:host([color='teal']) label.checked {
  color: var(--color-teal-1); }
  :host([color='teal']) label.checked .dot {
    border-color: var(--color-teal-1); }
  :host([color='teal']) label.checked .dot::after {
    background: var(--color-teal-1); }

:host([color='orange']) label.checked {
  color: var(--color-orange-1); }
  :host([color='orange']) label.checked .dot {
    border-color: var(--color-orange-1); }
  :host([color='orange']) label.checked .dot::after {
    background: var(--color-orange-1); }

:host([color='dark']) label.checked {
  color: var(--color-dark-1); }
  :host([color='dark']) label.checked .dot {
    border-color: var(--color-dark-1); }
  :host([color='dark']) label.checked .dot::after {
    background: var(--color-dark-1); }

:host([color='purple']) label.checked {
  color: var(--color-purple-1); }
  :host([color='purple']) label.checked .dot {
    border-color: var(--color-purple-1); }
  :host([color='purple']) label.checked .dot::after {
    background: var(--color-purple-1); }
</style>
  <label>
    <span class="dot"></span>
    <slot />
  </label>
`
      

    this.__SWITCH__ = this.root.lastElementChild
  }

  get value() {
    return this.props.value
  }

  set value(val) {
    this.props.value = val
  }

  get checked() {
    return this.props.checked
  }

  set checked(val) {
    this.props.checked = !!val
    this.__SWITCH__.classList.toggle('checked', this.props.checked)
  }

  get readOnly() {
    return this.props.readonly
  }

  set readOnly(val) {
    var type = typeof val

    if (val === this.props.readonly) {
      return
    }
    if ((type === 'boolean' && val) || type !== 'boolean') {
      this.props.readonly = true
      this.setAttribute('readonly', '')
    } else {
      this.props.readonly = false
      this.removeAttribute('readonly')
    }
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
    if (this.value === this.parentNode.value) {
      this.checked = true
    }

    this._handleClick = $.catch(this, 'click', ev => {
      if (this.disabled || this.readOnly || this.checked) {
        return
      }

      this.parentNode.dispatchEvent(
        new CustomEvent('child-picked', { detail: this.value })
      )
    })
  }

  disconnectedCallback() {
    $.unbind(this, 'click', this._handleClick)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'value':
        this.value = val
        break

      case 'checked':
      case 'readonly':
      case 'disabled':
        var k = name
        if (k === 'readonly') {
          k = 'readOnly'
        }
        this[k] = true
        break
    }
  }
}


if(!customElements.get('wc-radio-item')){
  customElements.define('wc-radio-item', RadioItem)
}
