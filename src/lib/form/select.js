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

function parseOptions(arr, props) {
  let html = ''
  for (let it of arr) {
    if (it.list) {
      html += `<dt>${it.name}</dt>`
      for (let _ of it.list) {
        props.DICT[_.value] = _
        if (!_.disabled) {
          props.LIST.push(_)
        }
        html += `<dd sub ${
          _.disabled ? 'disabled' : `data-idx="${props.LIST.length - 1}"`
        } ${_.value === props.value ? 'focus' : ''}>${_.label}</dd>`
      }
    } else {
      if (!it.disabled) {
        props.LIST.push(it)
      }
      props.DICT[it.value] = it
      html += `<dd ${
        it.disabled ? 'disabled' : `data-idx="${props.LIST.length - 1}"`
      } ${it.value === props.value ? 'focus' : ''}>${it.label}</dd>`
    }
  }
  return html
}

export default class Select extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["label","placeholder","multi","value","options","mvidx","readonly","disabled"]
  }

  props = {
    label: '',
    placeholder: '',
    multi: '',
    value: '',
    options: '',
    mvidx: null, //下拉列表光标的索引ID
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
  user-select: none;
  -moz-user-select: none;
  color: var(--color-dark-2);
  border-radius: 2px; }

.label {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 64px;
  width: 100%;
  height: 32px;
  line-height: 0;
  font-size: 14px;
  border: 1px solid var(--color-plain-3);
  border-radius: inherit;
  background: #fff;
  color: inherit;
  cursor: default;
  /* ----- */ }
  .label input {
    flex: 1;
    width: 0;
    min-width: 64px;
    width: 0;
    height: 100%;
    padding: 0 5px;
    border: 0;
    border-radius: inherit;
    color: inherit;
    font-size: inherit;
    background: none;
    outline: none;
    box-shadow: none;
    cursor: inherit; }
    .label input::placeholder {
      color: var(--color-grey-1); }
  .label .prepend,
  .label .append {
    display: none;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 30px;
    padding: 0 10px;
    white-space: nowrap;
    background: var(--color-plain-1); }
  .label .prepend {
    border-right: 1px solid var(--color-plain-3);
    border-radius: 2px 0 0 2px; }
  .label .append {
    border-left: 1px solid var(--color-plain-3);
    border-radius: 0 2px 2px 0; }
  .label[prepend] .prepend,
  .label[append] .append {
    display: flex; }
  .label .arrow {
    padding: 0 5px;
    --size: 14px;
    color: #ddd;
    transform: rotate(-90deg); }

.opt-box {
  display: none;
  position: fixed;
  z-index: 10260;
  left: 0;
  top: 0;
  width: 200px;
  height: auto;
  max-height: 200px;
  padding: 8px 0;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25);
  cursor: default; }
  .opt-box .list {
    width: 100%; }
  .opt-box::after {
    position: absolute;
    left: 30px;
    top: -4px;
    width: 8px;
    height: 8px;
    background: #fff;
    box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
    transform: rotate(45deg);
    content: ''; }
  .opt-box.show {
    display: flex; }
  .opt-box dt,
  .opt-box dd {
    overflow: hidden;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    text-align: left;
    text-overflow: ellipsis;
    white-space: nowrap; }
  .opt-box dt {
    font-size: 12px;
    color: var(--color-grey-1); }
  .opt-box dd {
    cursor: pointer; }
    .opt-box dd:hover, .opt-box dd[focus] {
      background: var(--color-plain-1); }
    .opt-box dd[focus] {
      color: var(--color-teal-1); }
    .opt-box dd[sub] {
      text-indent: 1em; }
    .opt-box dd[disabled] {
      color: var(--color-grey-1);
      cursor: not-allowed;
      background: none; }

/* --- */
:host([disabled]) .label {
  background: var(--color-plain-1);
  cursor: not-allowed;
  opacity: 0.6; }

:host([readonly]) .label {
  opacity: 0.8; }

:host(:focus-within) {
  box-shadow: 0 0 2px #88f7df; }

:host(:focus-within[readonly]) {
  box-shadow: 0 0 2px #f3be4d; }

/* 额外样式 */
:host([round]) {
  border-radius: 21px; }
  :host([round]) .label input {
    padding: 0 10px; }
  :host([round]) .prepend {
    border-radius: 21px 0 0 21px; }
  :host([round]) .append {
    border-radius: 0 21px 21px 0; }

:host([size='large']) .label {
  height: 42px;
  font-size: 16px; }

:host([size='large']) .prepend,
:host([size='large']) .append {
  height: 40px; }

:host([size='medium']) .label {
  height: 36px; }

:host([size='medium']) .prepend,
:host([size='medium']) .append {
  height: 34px; }

:host([size='mini']) .label {
  height: 24px;
  font-size: 12px; }

:host([size='mini']) .arrow {
  --size: 12px; }

:host([size='mini']) .prepend,
:host([size='mini']) .append {
  height: 18px; }
</style>
  <div class="label">
    <slot class="prepend" name="prepend"></slot>
    <input readonly />
    <wc-icon class="arrow" is="left"></wc-icon>
    <slot class="append" name="append"></slot>
    <div class="opt-box">
      <wc-scroll>
        <dl class="list"></dl>
      </wc-scroll>
    </div>
  </div>
`
      

    this.__OUTER__ = this.root.children[1]
    this.__PREPEND__ = this.__OUTER__.children[0]
    this.__INPUT__ = this.__OUTER__.children[1]
    this.__APPEND__ = this.__OUTER__.children[3]
    this.__OPTG__ = this.__OUTER__.children[4]
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
    var { DICT, active } = this.props
    this.props.value = val
    this.__INPUT__.value = (DICT && DICT[val] && DICT[val].label) || val
    if (!active) {
      this._updateStyle()
    }
  }

  _renderOptions(options) {
    this.props.DICT = {}
    this.props.LIST = []
    var elem = this.__OPTG__.firstElementChild.firstElementChild

    elem.innerHTML = parseOptions(options, this.props)
    this.props.ITEMS = Array.from(elem.children).filter(it => {
      return it.tagName === 'DD' && !it.hasAttribute('disabled')
    })
    this.value = this.props.value
  }

  // 移动光标选择下拉选项
  _moveSelect(ev) {
    var { LIST, DICT, ITEMS } = this.props
    if (LIST && LIST.length) {
      ev.preventDefault()
      var step = ev.keyCode === 38 ? -1 : 1

      if (this.props.mvidx === null) {
        this.props.mvidx = 0
      } else {
        this.props.mvidx += step
      }
      if (this.props.mvidx < 0) {
        this.props.mvidx = 0
      } else if (this.props.mvidx > ITEMS.length - 1) {
        this.props.mvidx = ITEMS.length - 1
      }

      ITEMS.forEach((it, i) => {
        if (i === this.props.mvidx) {
          this.__OPTG__.firstElementChild.scrollTop = it.offsetTop - 150
          it.setAttribute('focus', '')
        } else {
          it.removeAttribute('focus')
        }
      })
    }
  }

  _updateStyle(idx) {
    var { LIST, ITEMS, value } = this.props
    if (LIST && LIST.length) {
      if (idx === undefined) {
        for (let i = -1, it; (it = LIST[++i]); ) {
          if (value === it.value) {
            idx = i
            break
          }
        }
      }
      this.props.mvidx = idx
      ITEMS.forEach((it, i) => {
        if (i === idx) {
          it.setAttribute('focus', '')
        } else {
          it.removeAttribute('focus')
        }
      })
    }
  }

  // 触发列表选择
  _fetchSelect(idx, needUpdateStyle) {
    var item = this.props.LIST[idx]
    this.value = item.value
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: item
      })
    )
    if (needUpdateStyle) {
      this._updateStyle(idx)
    }
    this.props.active = false
    this.__OPTG__.classList.remove('show')
  }

  connectedCallback() {
    var prepend = this.__PREPEND__.assignedNodes()
    var append = this.__APPEND__.assignedNodes()

    // 相同插槽, 只允许1个
    while (prepend.length > 1) {
      this.removeChild(prepend.pop())
    }
    while (append.length > 1) {
      this.removeChild(append.pop())
    }

    if (prepend.length && this.props.type !== 'textarea') {
      this.__OUTER__.setAttribute('prepend', '')
    }
    if (append.length && this.props.type !== 'textarea') {
      this.__OUTER__.setAttribute('append', '')
    }

    function initPos() {
      var { x, y, width } = this.getBoundingClientRect()
      var size = this.getAttribute('size')
      this.props.active = true
      if (size && size === 'mini') {
        y += 32
      } else {
        y += 50
      }
      this.__OPTG__.style.cssText = `left:${x}px;top:${y}px;width:${width}px;`
    }

    /* ---------------------------------------------------- */
    /* -----------------     各种事件     ------------------ */
    /* ---------------------------------------------------- */

    // 键盘事件
    this._handleKeydown = $.catch(this.__INPUT__, 'keydown', ev => {
      if (this.disabled || this.readOnly) {
        return
      }
      // up: 38, down: 40
      if (ev.keyCode === 38 || ev.keyCode === 40) {
        if (!this.props.active) {
          initPos.call(this)
          this.__OPTG__.classList.toggle('show', true)
          return
        }
        return this._moveSelect(ev)
      }
      // 回车触发select事件
      if (ev.keyCode === 13) {
        if (this.props.mvidx !== null && this.props.active) {
          return this._fetchSelect(this.props.mvidx)
        }
      }
    })

    // 渲染列表
    this._activeFn = $.bind(this.__INPUT__, 'click', ev => {
      var { options } = this.props

      if (this.disabled || this.readOnly) {
        return
      }

      initPos.call(this)
      this.__OPTG__.classList.toggle('show')
    })

    // 选择选项
    this._handleSelect = $.bind(this.__OPTG__, 'click', ev => {
      if (ev.target.tagName === 'DD' && !ev.target.hasAttribute('disabled')) {
        this._fetchSelect(+ev.target.dataset.idx, true)
        this.dispatchEvent(new CustomEvent('input'))
      }
    })

    this._inactiveFn = $.outside(this, ev => {
      this.__OPTG__.classList.toggle('show', false)
      this.props.active = false
    })
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      // label和placeholder 功能相同
      case 'label':
      case 'placeholder':
        this.__INPUT__.setAttribute('placeholder', val)
        break

      case 'options':
        if (val) {
          try {
            this._renderOptions(JSON.parse(val))
          } catch (err) {}
          this.removeAttribute('options')
        }
        break

      case 'value':
        this.value = val
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

  disconnectedCallback() {
    $.unbind(this.__INPUT__, 'keydown', this._handleKeydown)
    $.unbind(this.__INPUT__, 'click', this._activeFn)
    $.unbind(this.__OPTG__, 'click', this._handleSelect)
    $.clearOutside(this._inactiveFn)
  }
}


if(!customElements.get('wc-select')){
  customElements.define('wc-select', Select)
}
