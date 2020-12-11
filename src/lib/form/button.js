/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import "../icon/index.js"
import $ from "../utils.js"

const IS_FIREFOX = !!window.sidebar

export default class Button extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["icon","autofocus","loading","disabled","lazy"]
  }

  props = {
    icon: '',
    autofocus: '',
    loading: false,
    disabled: false,
    lazy: 0 // 并发拦截时间, 单位毫秒
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
  overflow: hidden;
  display: inline-block;
  min-width: 64px;
  height: 32px;
  border-radius: 2px;
  user-select: none;
  -moz-user-select: none;
  color: var(--color-dark-2);
  font-size: 14px;
  cursor: pointer; }
  :host button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: inherit;
    padding: 0 10px;
    margin: auto;
    line-height: 0;
    border: 1px solid var(--color-plain-3);
    border-radius: inherit;
    white-space: nowrap;
    background: #fff;
    font-size: inherit;
    font-family: inherit;
    outline: none;
    color: inherit;
    cursor: inherit; }
    :host button:hover {
      background: var(--color-plain-1); }
    :host button:active {
      border-color: var(--color-grey-1); }
    :host button::-moz-focus-inner {
      border: none; }
  :host .icon {
    --size: 18px;
    margin-right: 3px; }

:host([size='large']) {
  min-width: 120px;
  height: 42px;
  font-size: 16px; }
  :host([size='large']) .icon {
    --size: 20px; }

:host([size='large'][circle]) {
  min-width: 62px;
  height: 62px; }
  :host([size='large'][circle]) button {
    padding: 0 20px; }

:host([size='medium']) {
  min-width: 90px;
  height: 36px; }
  :host([size='medium']) button {
    padding: 0 15px; }

:host([size='medium'][circle]) {
  min-width: 36px; }

:host([size='mini']),
:host([text]) {
  min-width: 24px;
  height: 24px;
  font-size: 12px; }
  :host([size='mini']) button,
  :host([text]) button {
    padding: 0 5px; }
  :host([size='mini']) .icon,
  :host([text]) .icon {
    --size: 14px; }

:host([size='mini'][circle]) {
  min-width: 24px; }

:host([text]) {
  height: 18px; }
  :host([text]) button {
    padding: 0;
    border: 0; }
    :host([text]) button:hover {
      background: none;
      text-decoration: underline; }

:host([round]) {
  border-radius: 21px; }

:host([circle]) {
  min-width: 32px;
  border-radius: 50%; }
  :host([circle]) button {
    padding: 0; }
  :host([circle]) .icon {
    margin-right: 0; }

:host([loading]),
:host([disabled]) {
  cursor: not-allowed;
  color: var(--color-grey-1);
  opacity: 0.6; }
  :host([loading]) .icon,
  :host([disabled]) .icon {
    color: var(--color-grey-1); }
  :host([loading]) button,
  :host([disabled]) button {
    background: #fff;
    border-color: var(--color-plain-3); }

:host([color]) {
  color: #fff; }
  :host([color]) button {
    border-color: transparent; }
  :host([color]) .icon {
    color: #fff; }

:host([color='red']) button {
  background: var(--color-red-2); }
  :host([color='red']) button:hover {
    background: var(--color-red-1); }
  :host([color='red']) button:active {
    background: var(--color-red-3); }

:host([color='red'][text]) button {
  background: transparent;
  color: var(--color-red-2); }
  :host([color='red'][text]) button:hover {
    color: var(--color-red-1); }
  :host([color='red'][text]) button:active {
    color: var(--color-red-3); }

:host([color='red'][loading]) button,
:host([color='red'][disabled]) button {
  background: var(--color-red-1); }

:host([color='blue']) button {
  background: var(--color-blue-2); }
  :host([color='blue']) button:hover {
    background: var(--color-blue-1); }
  :host([color='blue']) button:active {
    background: var(--color-blue-3); }

:host([color='blue'][text]) button {
  background: transparent;
  color: var(--color-blue-2); }
  :host([color='blue'][text]) button:hover {
    color: var(--color-blue-1); }
  :host([color='blue'][text]) button:active {
    color: var(--color-blue-3); }

:host([color='blue'][loading]) button,
:host([color='blue'][disabled]) button {
  background: var(--color-blue-1); }

:host([color='green']) button {
  background: var(--color-green-2); }
  :host([color='green']) button:hover {
    background: var(--color-green-1); }
  :host([color='green']) button:active {
    background: var(--color-green-3); }

:host([color='green'][text]) button {
  background: transparent;
  color: var(--color-green-2); }
  :host([color='green'][text]) button:hover {
    color: var(--color-green-1); }
  :host([color='green'][text]) button:active {
    color: var(--color-green-3); }

:host([color='green'][loading]) button,
:host([color='green'][disabled]) button {
  background: var(--color-green-1); }

:host([color='teal']) button {
  background: var(--color-teal-2); }
  :host([color='teal']) button:hover {
    background: var(--color-teal-1); }
  :host([color='teal']) button:active {
    background: var(--color-teal-3); }

:host([color='teal'][text]) button {
  background: transparent;
  color: var(--color-teal-2); }
  :host([color='teal'][text]) button:hover {
    color: var(--color-teal-1); }
  :host([color='teal'][text]) button:active {
    color: var(--color-teal-3); }

:host([color='teal'][loading]) button,
:host([color='teal'][disabled]) button {
  background: var(--color-teal-1); }

:host([color='orange']) button {
  background: var(--color-orange-2); }
  :host([color='orange']) button:hover {
    background: var(--color-orange-1); }
  :host([color='orange']) button:active {
    background: var(--color-orange-3); }

:host([color='orange'][text]) button {
  background: transparent;
  color: var(--color-orange-2); }
  :host([color='orange'][text]) button:hover {
    color: var(--color-orange-1); }
  :host([color='orange'][text]) button:active {
    color: var(--color-orange-3); }

:host([color='orange'][loading]) button,
:host([color='orange'][disabled]) button {
  background: var(--color-orange-1); }

:host([color='dark']) button {
  background: var(--color-dark-2); }
  :host([color='dark']) button:hover {
    background: var(--color-dark-1); }
  :host([color='dark']) button:active {
    background: var(--color-dark-3); }

:host([color='dark'][text]) button {
  background: transparent;
  color: var(--color-dark-2); }
  :host([color='dark'][text]) button:hover {
    color: var(--color-dark-1); }
  :host([color='dark'][text]) button:active {
    color: var(--color-dark-3); }

:host([color='dark'][loading]) button,
:host([color='dark'][disabled]) button {
  background: var(--color-dark-1); }

:host([color='purple']) button {
  background: var(--color-purple-2); }
  :host([color='purple']) button:hover {
    background: var(--color-purple-1); }
  :host([color='purple']) button:active {
    background: var(--color-purple-3); }

:host([color='purple'][text]) button {
  background: transparent;
  color: var(--color-purple-2); }
  :host([color='purple'][text]) button:hover {
    color: var(--color-purple-1); }
  :host([color='purple'][text]) button:active {
    color: var(--color-purple-3); }

:host([color='purple'][loading]) button,
:host([color='purple'][disabled]) button {
  background: var(--color-purple-1); }

:host([color='grey']) button {
  background: var(--color-grey-2); }
  :host([color='grey']) button:hover {
    background: var(--color-grey-1); }
  :host([color='grey']) button:active {
    background: var(--color-grey-3); }

:host([color='grey'][text]) button {
  background: transparent;
  color: var(--color-grey-2); }
  :host([color='grey'][text]) button:hover {
    color: var(--color-grey-1); }
  :host([color='grey'][text]) button:active {
    color: var(--color-grey-3); }

:host([color='grey'][loading]) button,
:host([color='grey'][disabled]) button {
  background: var(--color-grey-1); }

:host([no-border]) button {
  border-color: transparent;
  background: inherit; }

:host([text][loading]) button, :host([text][loading]) button:hover, :host([text][loading]) button:active,
:host([text][disabled]) button,
:host([text][disabled]) button:hover,
:host([text][disabled]) button:active {
  text-decoration: none;
  background: transparent; }

:host(:focus-within) {
  box-shadow: 0 0 2px #88f7df; }

:host(:focus-within[disabled]),
:host(:focus-within[loading]) {
  box-shadow: none; }
</style>
  <button>
    <wc-icon class="icon"></wc-icon>
    <slot></slot>
  </button>
`
      

    // 圆形按钮不允许文字
    if (this.hasAttribute('circle')) {
      this.textContent = ''
    }

    this.__BTN__ = this.root.children[1]
    this.__ICO__ = this.__BTN__.children[0]
  }

  get loading() {
    return this.props.loading
  }

  set loading(val) {
    var type = typeof val

    if (val === this.props.loading) {
      return
    }

    if ((type === 'boolean' && val) || type !== 'boolean') {
      this.props.loading = true
      this.__ICO__.setAttribute('is', 'loading')
      this.setAttribute('loading', '')
    } else {
      this.props.loading = false
      this.__ICO__.setAttribute('is', this.props.icon)
      this.removeAttribute('loading')
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
    this.stamp = 0

    // 阻止事件冒泡, 避免用户自己绑定click事件不受这2个值的限制
    this._handleClick = $.bind(this.__BTN__, 'click', ev => {
      var { loading, disabled, lazy } = this.props
      var now = Date.now()

      if (loading || disabled) {
        return ev.stopPropagation()
      }
      // 并发拦截
      if (lazy && now - this.stamp < lazy) {
        return ev.stopPropagation()
      }
      this.stamp = now
    })
  }

  disconnectedCallback() {
    $.unbind(this.__BTN__, 'click', this._handleClick)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'icon':
        this.props.icon = val
        if (val) {
          if (!this.props.loading) {
            this.__ICO__.setAttribute('is', val)
          }
        } else {
          this.removeAttribute('icon')
          this.__ICO__.removeAttribute('is')
        }
        break

      case 'autofocus':
        this.__BTN__.setAttribute('autofocus', '')
        // 辣鸡火狐, 要触发一下focus, 才能聚焦
        if (IS_FIREFOX) {
          setTimeout(_ => {
            this.__BTN__.focus()
          }, 10)
        }
        break
      case 'lazy':
        this.props.lazy = val >> 0
        break

      case 'loading':
      case 'disabled':
        this[name] = true
        break
    }
  }
}


if(!customElements.get('wc-button')){
  customElements.define('wc-button', Button)
}
