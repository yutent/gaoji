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

const TYPES = ['text', 'textarea', 'password']
const INPUTS = {
  text: '<input spellcheck="false">',
  textarea: '<textarea spellcheck="false"></textarea>'
}

export default class Input extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["value","icon","type","placeholder","maxlength","minlength","autofocus","readonly","disabled"]
  }

  props = {
    value: '',
    icon: '',
    type: 'text',
    placeholder: '',
    maxlength: null,
    minlength: null,
    autofocus: false,
    readonly: false,
    disabled: false
  }
  

  state = {
    mvidx: null //下拉列表光标的索引ID
  }

  constructor() {
    super();
    var type = this.getAttribute('type')
    var input = ''

    if (type !== 'textarea') {
      type = 'text'
    }

    input = INPUTS[type]

    
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

ul,
li {
  list-style: none; }

:host {
  overflow: hidden;
  display: inline-block;
  user-select: none;
  -moz-user-select: none;
  color: var(--color-dark-1);
  border-radius: 2px;
  cursor: text; }

.label {
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 64px;
  width: 100%;
  height: 32px;
  font-size: 14px;
  border: 1px solid var(--color-plain-3);
  border-radius: inherit;
  background: var(--bg-color, #fff);
  color: inherit;
  cursor: inherit;
  /* ----- */ }
  .label input,
  .label textarea {
    flex: 1;
    min-width: 32px;
    width: 0;
    height: 100%;
    padding: 0 5px;
    border: 0;
    border-radius: inherit;
    color: inherit;
    font: inherit;
    background: none;
    outline: none;
    box-shadow: none;
    cursor: inherit; }
    .label input::placeholder,
    .label textarea::placeholder {
      color: var(--color-grey-1); }
  .label textarea {
    padding: 5px 8px;
    resize: none; }
  .label .prepend,
  .label .append {
    display: none;
    justify-content: center;
    align-items: center;
    width: auto;
    height: 30px;
    padding: 0 10px;
    line-height: 0;
    background: var(--bg-color, --color-plain-1);
    white-space: nowrap; }
  .label .prepend {
    border-right: 1px solid var(--color-plain-3);
    border-radius: 2px 0 0 2px; }
  .label .append {
    border-left: 1px solid var(--color-plain-3);
    border-radius: 0 2px 2px 0; }
  .label[prepend] .prepend,
  .label[append] .append {
    display: flex; }
  .label[prepend] input,
  .label[append] input {
    min-width: 64px; }
  .label .icon {
    --size: 20px;
    padding: 0 5px;
    margin: 0 5px;
    color: var(--color-grey-2); }

.suggestion {
  display: none;
  position: fixed;
  z-index: 10240;
  left: 0;
  top: 0;
  width: 200px;
  height: auto;
  max-height: 200px;
  min-height: 46px;
  padding: 8px 0;
  border-radius: 2px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.25); }
  .suggestion .list {
    width: 100%; }
  .suggestion::after {
    position: absolute;
    left: 30px;
    top: -4px;
    width: 8px;
    height: 8px;
    background: #fff;
    box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.1);
    transform: rotate(45deg);
    content: ''; }
  .suggestion.show {
    display: flex; }
  .suggestion li {
    overflow: hidden;
    width: 100%;
    height: 30px;
    line-height: 30px;
    padding: 0 8px;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer; }
    .suggestion li:hover, .suggestion li[focus] {
      background: var(--color-plain-1); }

/* --- */
:host([auto-border]) .label {
  border-color: transparent; }

:host([disabled]) {
  cursor: not-allowed; }
  :host([disabled]) .label {
    background: var(--color-plain-1);
    opacity: 0.6; }

:host([readonly]) {
  cursor: default; }

:host(:focus-within) {
  box-shadow: 0 0 2px #88f7df; }
  :host(:focus-within) .label {
    border-color: var(--color-plain-3); }

:host(:focus-within[readonly]) {
  box-shadow: 0 0 2px #f3be4d; }

:host([type='textarea']) {
  display: flex;
  height: 80px; }
  :host([type='textarea']) .label {
    width: 100%;
    height: 100%; }
  :host([type='textarea']) .icon,
  :host([type='textarea']) .suggestion {
    display: none; }

/* 额外样式 */
:host([round]) {
  border-radius: 21px; }
  :host([round]) .label input {
    padding: 0 10px; }
  :host([round]) .label[prepend] input,
  :host([round]) .label[append] input {
    padding: 0 5px; }
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

:host([size='mini']) .icon {
  --size: 16px; }

:host([size='mini']) .prepend,
:host([size='mini']) .append {
  height: 18px; }

:host([no-border]),
:host(:focus-within[no-border]) {
  box-shadow: none; }
  :host([no-border]) .label,
  :host(:focus-within[no-border]) .label {
    border: 0; }

:host([transparent]) .label {
  background: transparent; }
</style>
  <div class="label">
    <slot class="prepend" name="prepend"></slot>
    ${input}
    <wc-icon class="icon"></wc-icon>
    <slot class="append" name="append"></slot>

    <div class="suggestion">
      <wc-scroll>
        <ul class="list"></ul>
      </wc-scroll>
    </div>
  </div>
`
      

    this.props.type = type

    this.__OUTER__ = this.root.children[1]
    this.__PREPEND__ = this.__OUTER__.children[0]
    this.__INPUT__ = this.__OUTER__.children[1]
    this.__ICO__ = this.__OUTER__.children[2]
    this.__APPEND__ = this.__OUTER__.children[3]
    this.__LIST__ = this.__OUTER__.children[4]
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
    return this.__INPUT__.value
  }

  set value(val) {
    this.__INPUT__.value = val
  }

  get type() {
    return this.__INPUT__.type
  }

  set type(val) {
    if (val !== 'textarea') {
      this.__INPUT__.type = val
    }
  }

  // 移动光标选择下拉选项
  _moveSelect(ev) {
    var { list } = this.props
    if (list && list.length) {
      ev.preventDefault()
      var step = ev.keyCode === 38 ? -1 : 1
      var items = Array.from(
        this.__LIST__.firstElementChild.firstElementChild.children
      )
      if (this.state.mvidx === null) {
        this.state.mvidx = 0
      } else {
        this.state.mvidx += step
      }
      if (this.state.mvidx < 0) {
        this.state.mvidx = 0
      } else if (this.state.mvidx > items.length - 1) {
        this.state.mvidx = items.length - 1
      }
      items.forEach((it, i) => {
        if (i === this.state.mvidx) {
          this.__LIST__.firstElementChild.scrollTop = it.offsetTop - 150
          it.setAttribute('focus', '')
        } else {
          it.removeAttribute('focus')
        }
      })
    }
  }

  // 触发列表选择
  _fetchSelect(idx, ev) {
    var item = this.props.list[idx]
    this.value = item.value
    this.dispatchEvent(
      new CustomEvent('select', {
        detail: item
      })
    )
    this._handleChange(ev)
    this.__LIST__.classList.remove('show')
    this.state.mvidx = null
  }

  _updateAttr() {
    var { maxlength, minlength } = this.props

    if (maxlength && maxlength > 0) {
      this.__INPUT__.setAttribute('maxlength', maxlength)
    } else {
      this.__INPUT__.removeAttribute('maxlength')
    }
    if (minlength && minlength > 0) {
      this.__INPUT__.setAttribute('minlength', minlength)
    } else {
      this.__INPUT__.removeAttribute('minlength')
    }
  }

  connectedCallback() {
    var prepend = this.__PREPEND__.assignedNodes()
    var append = this.__APPEND__.assignedNodes()
    var { type } = this.props

    // 相同插槽, 只允许1个
    while (prepend.length > 1) {
      this.removeChild(prepend.pop())
    }
    while (append.length > 1) {
      this.removeChild(append.pop())
    }

    if (prepend.length && type !== 'textarea') {
      this.__OUTER__.setAttribute('prepend', '')
    }
    if (append.length && type !== 'textarea') {
      this.__OUTER__.setAttribute('append', '')
    }

    this._updateAttr()

    // 键盘事件
    this._handleSubmit = $.catch(this.__INPUT__, 'keydown', ev => {
      if (this.disabled || this.readOnly) {
        return
      }
      // up: 38, down: 40
      if (ev.keyCode === 38 || ev.keyCode === 40) {
        // 仅普通文本表单, 密码和多行文本框不做响应
        if (type === 'text') {
          return this._moveSelect(ev)
        }
      }
      // 回车触发submit事件
      // textarea 要按Ctrl Or Cmd键, 才会触发
      if (ev.keyCode === 13) {
        // 如果是输入建议存在,则第1次回车的时候, 不触发提交
        if (type === 'text' && this.state.mvidx !== null) {
          return this._fetchSelect(this.state.mvidx, ev)
        }

        if (
          type === 'text' ||
          (type === 'textarea' && (ev.ctrlKey || ev.metaKey))
        ) {
          this.dispatchEvent(
            new CustomEvent('submit', {
              detail: this.value
            })
          )
        }
      }
    })

    // 非textarea, 可做输入建议功能
    if (type === 'text') {
      // 输入状态事件
      this._handleChange = $.bind(this.__INPUT__, 'input', ev => {
        ev.preventDefault()
        this.dispatchEvent(
          new CustomEvent('fetch-suggest', {
            detail: {
              value: this.value,
              send: list => {
                this.props.list = list
                this._parseSuggestion()
              }
            }
          })
        )
      })

      // 渲染建议列表
      this._parseSuggestion = $.bind(this.__INPUT__, 'click', ev => {
        var { list } = this.props
        let { x, y, width } = this.getBoundingClientRect()
        if (list && list.length) {
          var html = list
            .map((it, i) => `<li data-idx="${i}">${it.value}</li>`)
            .join('')
          this.__LIST__.firstElementChild.firstElementChild.innerHTML = html
          this.__LIST__.classList.toggle('show', true)
          this.__LIST__.style.cssText = `left:${x}px;top:${y +
            50}px;width:${width}px;`
        } else {
          this.__LIST__.classList.toggle('show', false)
        }
      })

      this._inactiveFn = $.outside(this, ev => {
        this.__LIST__.classList.remove('show')
      })

      // 选择建议
      this._handleSelect = $.bind(this.__LIST__, 'click', ev => {
        if (ev.target.tagName === 'LI') {
          this._fetchSelect(ev.target.dataset.idx, ev)
          this.dispatchEvent(new CustomEvent('input'))
        }
      })
    } else {
      this._handleWheel = $.catch(this.__INPUT__, 'wheel')
    }
  }

  disconnectedCallback() {
    $.unbind(this.__INPUT__, 'wheel', this._handleWheel)
    $.unbind(this.__INPUT__, 'keydown', this._handleSubmit)
    $.unbind(this.__INPUT__, 'input', this._handleChange)
    $.unbind(this.__LIST__, 'click', this._handleSelect)
    $.clearOutside(this._inactiveFn)
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'icon':
        this.props.icon = val
        if (val) {
          this.__ICO__.setAttribute('is', val)
        } else {
          this.removeAttribute('icon')
          this.__ICO__.removeAttribute('is')
        }
        break

      case 'autofocus':
        this.__INPUT__.setAttribute('autofocus', '')
        // 辣鸡火狐, 要触发一下focus, 才能聚焦
        setTimeout(_ => {
          this.__INPUT__.focus()
        }, 10)

        break

      case 'placeholder':
        this.__INPUT__.setAttribute('placeholder', val)
        break

      case 'type':
        if (~TYPES.indexOf(val)) {
          this.type = val
        } else {
          this.type = 'text'
        }
        break

      case 'value':
        this.value = val
        break

      case 'maxlength':
      case 'minlength':
        this.props[name] = val
        this._updateAttr()
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


if(!customElements.get('wc-input')){
  customElements.define('wc-input', Input)
}
