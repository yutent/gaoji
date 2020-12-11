/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import "../scroll/index.js"
import "../icon/index.js"
import $ from "../utils.js"

export default class Number extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["value","max","min","step","autofocus","readonly","disabled"]
  }

  props = {
    value: 0,
    max: null,
    min: null,
    step: 1,
    autofocus: false,
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

    this.root.innerHTML = `<style>@charset "UTF-8";
* {
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
  overflow: hidden;
  display: inline-block;
  width: 128px;
  height: 32px;
  user-select: none;
  -moz-user-select: none;
  color: var(--color-dark-2);
  border-radius: 2px; }

.label {
  display: flex;
  width: 100%;
  height: 100%;
  margin: 0 auto;
  line-height: 0;
  font-size: 14px;
  border: 1px solid var(--color-plain-3);
  border-radius: inherit;
  background: var(--bg-color, #fff);
  color: inherit;
  cursor: text;
  /* ----- */ }
  .label span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 100%;
    background: var(--bg-color, --color-plain-1);
    font-size: 18px;
    cursor: pointer; }
    .label span:first-child {
      border-radius: 2px 0 0 2px;
      border-right: 1px solid var(--color-plain-3); }
    .label span:last-child {
      border-radius: 0 2px 2px 0;
      border-left: 1px solid var(--color-plain-3); }
    .label span.disabled {
      cursor: not-allowed;
      opacity: 0.6; }
  .label input {
    flex: 1;
    min-width: 0;
    width: 0;
    height: 100%;
    padding: 0 5px;
    border: 0;
    border-radius: inherit;
    color: inherit;
    text-align: center;
    font-size: inherit;
    font-family: inherit;
    background: none;
    outline: none;
    box-shadow: none;
    cursor: inherit; }
    .label input::placeholder {
      color: var(--color-grey-1); }
  .label .icon {
    padding: 0 5px;
    --size: 20px; }

/* --- */
:host([readonly]) .label {
  cursor: default;
  opacity: 0.8; }
  :host([readonly]) .label span {
    cursor: inherit; }

:host([disabled]) .label {
  background: var(--color-plain-1);
  cursor: not-allowed;
  opacity: 0.6; }
  :host([disabled]) .label span {
    cursor: inherit; }

:host(:focus-within) {
  box-shadow: 0 0 2px #88f7df; }

:host(:focus-within[readonly]) {
  box-shadow: 0 0 2px #f3be4d; }

/* 额外样式 */
:host([round]) {
  border-radius: 21px; }
  :host([round]) .label span:first-child {
    border-radius: 21px 0 0 21px; }
  :host([round]) .label span:last-child {
    border-radius: 0 21px 21px 0; }

:host([size='large']) {
  width: 192px;
  height: 42px; }
  :host([size='large']) .label {
    font-size: 16px; }
    :host([size='large']) .label span {
      width: 48px; }
  :host([size='large']) .prepend,
  :host([size='large']) .append {
    height: 40px; }

:host([size='medium']) {
  width: 144px;
  height: 36px; }
  :host([size='medium']) .label span {
    width: 36px; }
  :host([size='medium']) .prepend,
  :host([size='medium']) .append {
    height: 34px; }

:host([size='mini']) {
  width: 96px;
  height: 24px; }
  :host([size='mini']) .label {
    font-size: 12px; }
    :host([size='mini']) .label span {
      width: 28px; }
  :host([size='mini']) .icon {
    --size: 16px; }
  :host([size='mini']) .prepend,
  :host([size='mini']) .append {
    height: 18px; }
</style>
  <div class="label">
    <span data-act="-">-</span>
    <!-- <wc-icon class="icon" is="minus"></wc-icon> -->
    <input value="0" maxlength="9" />
    <span data-act="+">+</span>
    <!-- <wc-icon class="icon" is="plus"></wc-icon> -->
  </div>
`
      

    this.__OUTER__ = this.root.children[1]
    this.__INPUT__ = this.__OUTER__.children[1]
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
      this.__INPUT__.setAttribute('readonly', '')
    } else {
      this.props.readonly = false
      this.removeAttribute('readonly')
      this.__INPUT__.removeAttribute('readonly')
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
      this.__INPUT__.setAttribute('disabled', '')
    } else {
      this.props.disabled = false
      this.removeAttribute('disabled')
      this.__INPUT__.removeAttribute('disabled')
    }
  }

  get value() {
    return this.props.value
  }

  set value(val) {
    var n = +val
    if (n === n) {
      val = n
    } else {
      val = 0
    }
    this.props.value = val
    this.__INPUT__.value = val

    this._checkActionEnable()
  }

  _checkActionEnable() {
    var { max, min, value } = this.props
    var n = value

    if (min !== null) {
      if (min > n) {
        n = min
      }
      this.__OUTER__.children[0].classList.toggle('disabled', value <= min)
    }
    if (max !== null) {
      if (max < n) {
        n = max
      }
      this.__OUTER__.children[2].classList.toggle('disabled', value >= max)
    }
    if (n !== value) {
      this.props.value = n
      this.__INPUT__.value = n
      this.dispatchEvent(new CustomEvent('input'))
    }
  }

  _updateValue(act) {
    var { max, min, value, step } = this.props
    if (act === '+') {
      if (max !== null && max < value + step) {
        return
      }
      value += step
    } else {
      if (min !== null && min > value - step) {
        return
      }
      value -= step
    }
    this.props.value = +value.toFixed(2)
    this.__INPUT__.value = this.props.value
    this._checkActionEnable()
    this.dispatchEvent(new CustomEvent('input'))
  }

  connectedCallback() {
    // 键盘事件
    this._handleSubmit = $.catch(this.__INPUT__, 'keydown', ev => {
      if (this.disabled || this.readOnly) {
        return
      }

      // up: 38, down: 40
      if (ev.keyCode === 38 || ev.keyCode === 40) {
        ev.preventDefault()
        return this._updateValue(ev.keyCode === 38 ? '+' : '-')
      }
      // 回车触发submit事件
      if (ev.keyCode === 13) {
        ev.preventDefault()
        this.dispatchEvent(
          new CustomEvent('submit', {
            detail: this.value
          })
        )
      }
    })

    this._handleChange = $.catch(this.__INPUT__, 'change', ev => {
      if (isFinite(this.__INPUT__.value)) {
        this.props.value = +this.__INPUT__.value
        if (!this.__INPUT__.value.endsWith('.')) {
          this.__INPUT__.value = this.props.value
        }
      } else {
        this.__INPUT__.value = this.props.value = 0
      }
      this.dispatchEvent(new CustomEvent('input'))
    })

    this._handleAction = $.bind(this.__OUTER__, 'click', ev => {
      if (this.disabled || this.readOnly) {
        return
      }
      var target = ev.target

      if (target.tagName === 'SPAN' || target.parentNode === 'SPAN') {
        var act = target.dataset.act || target.parentNode.dataset.act

        this._updateValue(act)
      }
    })
  }

  disconnectedCallback() {
    $.unbind(this.__INPUT__, 'keydown', this._handleSubmit)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'autofocus':
        this.__INPUT__.setAttribute('autofocus', '')
        // 辣鸡火狐, 要触发一下focus, 才能聚焦
        setTimeout(_ => {
          this.__INPUT__.focus()
        }, 10)
        break

      case 'value':
        this.value = val >> 0
        break

      case 'step':
      case 'max':
      case 'min':
        var n = +val
        if (n === n) {
          this.props[name] = n
        }
        this._checkActionEnable()
        break

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


if(!customElements.get('wc-number')){
  customElements.define('wc-number', Number)
}
