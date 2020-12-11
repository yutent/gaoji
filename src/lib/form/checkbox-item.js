/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import "../icon/index.js"
import $ from "../utils.js"

export default class CheckboxItem extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["color","value","checked","readonly","disabled"]
  }

  props = {
    color: '',
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
    line-height: 0;
    -moz-user-select: none;
    user-select: none;
    white-space: nowrap;
    cursor: inherit;
    color: var(--color-grey-3); }
  :host .dot {
    --size: 18px;
    padding: 2px;
    margin-right: 3px; }

:host([readonly]) {
  opacity: 0.8; }

:host([disabled]) {
  cursor: not-allowed;
  opacity: 0.6; }

:host([size='large']) {
  font-size: 16px; }
  :host([size='large']) label {
    height: 42px; }
  :host([size='large']) .dot {
    --size: 22px; }

:host([size='medium']) label {
  height: 38px; }

:host([size='medium']) .dot {
  --size: 20px; }

:host([size='mini']) {
  font-size: 12px; }
  :host([size='mini']) label {
    height: 20px; }
  :host([size='mini']) .dot {
    --size: 14px; }

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
    <wc-icon class="dot" is="checkbox-off"></wc-icon>
    <slot />
  </label>
`
      

    this.__SWITCH__ = this.root.lastElementChild
    this.__ICO__ = this.__SWITCH__.children[0]

    this._isInGroup = false
  }

  _checkGroup() {
    this._isInGroup = this.parentNode.tagName === 'WC-CHECKBOX'
    if (this._isInGroup && this.parentNode.root) {
      if (this.parentNode.value.includes(this.value)) {
        this.checked = true
      }
    }
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
    var { checked, color } = this.props
    this.__SWITCH__.classList.toggle('checked', checked)
    this.__ICO__.setAttribute('is', 'checkbox-' + (checked ? 'on' : 'off'))

    if (checked) {
      this.__ICO__.setAttribute('color', color)
    } else {
      this.__ICO__.removeAttribute('color')
    }
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
    this._checkGroup()

    this._handlClick = $.bind(this, 'click', ev => {
      ev.preventDefault()

      if (this.disabled || this.readOnly) {
        return
      }

      this.checked = !this.checked

      if (this._isInGroup) {
        this.parentNode.dispatchEvent(
          new CustomEvent('child-picked', {
            detail: { value: this.value, checked: this.checked }
          })
        )
      } else {
        this.dispatchEvent(new CustomEvent('input'))
      }
    })
  }

  disconnectedCallback() {
    $.unbind(this, 'click', this._handlClick)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'value':
      case 'color':
        this.props[name] = val
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


if(!customElements.get('wc-checkbox-item')){
  customElements.define('wc-checkbox-item', CheckboxItem)
}
