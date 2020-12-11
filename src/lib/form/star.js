/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 * 
 */


import $ from "../utils.js"

export default class Star extends HTMLElement  {
  
    
  static get observedAttributes() {
    return ["value","text","size","color","'allow-half'","'show-value'","starSize","disabled"]
  }

  props = {
    value: 0,
    text: [],
    size: '',
    color: '',
    'allow-half': false,
    'show-value': false,
    starSize: 32, // 星星的宽度, 用于实现半星
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
  display: flex;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
  cursor: pointer;
  font-size: 14px;
  --size: 24px; }

label {
  display: flex;
  align-items: center;
  line-height: 0;
  cursor: inherit; }
  label wc-icon {
    margin: 0 3px;
    transition: transform 0.1s easein-out; }
    label wc-icon:hover {
      transform: scale(1.05); }
  label span {
    padding: 0 8px;
    margin: 0 3px; }

:host([size='large']) {
  font-size: 16px;
  --size: 36px; }

:host([size='medium']) {
  --size: 30px; }

:host([size='mini']) {
  font-size: 12px;
  --size: 20px; }

:host([color='red']) label span {
  color: var(--color-red-1); }

:host([color='teal']) label span {
  color: var(--color-teal-1); }

:host([color='green']) label span {
  color: var(--color-green-1); }

:host([color='grey']) label span {
  color: var(--color-grey-1); }

:host([color='blue']) label span {
  color: var(--color-blue-1); }

:host([color='purple']) label span {
  color: var(--color-purple-1); }

:host([color='orange']) label span {
  color: var(--color-orange-1); }

:host([disabled]) {
  cursor: default;
  opacity: 0.6; }
  :host([disabled]) label wc-icon:hover {
    transform: none; }
</style>
  <label>
    <wc-icon data-idx="0" is="star" color="grey"></wc-icon>
    <wc-icon data-idx="1" is="star" color="grey"></wc-icon>
    <wc-icon data-idx="2" is="star" color="grey"></wc-icon>
    <wc-icon data-idx="3" is="star" color="grey"></wc-icon>
    <wc-icon data-idx="4" is="star" color="grey"></wc-icon>
    <span class="text"></span>
  </label>
`
      

    this.__BOX__ = this.root.children[1]
    this.__STARS__ = Array.from(this.__BOX__.children)
    this.__TEXT__ = this.__STARS__.pop()
  }

  get value() {
    return this.props.value
  }

  set value(val) {
    var v = +val
    var tmp = val >> 0
    if (v === v && v > 0) {
      val = v
    } else {
      val = 0
    }

    if (val > 5) {
      val = 5
    }

    this.props.value = val
    this._updateDraw(-1)
  }

  /**
   * 更新图标渲染
   * i: int
   * f: float
   */
  _updateDraw(i, f = 0) {
    var _last = 'star-half'
    var { value, tmp = { i: 0, f: 0 } } = this.props

    if (i === -1) {
      i = Math.floor(value)
      f = +(value % 1).toFixed(1)
      if (i > 0 && i === value) {
        i--
        f = 1
      }
    }

    if (!this.props['allow-half']) {
      f = f > 0 ? 1 : 0
    }
    // 减少DOM操作
    if (i === tmp.i && f === tmp.f) {
      return
    }

    if (f > 0.5) {
      _last = 'star-full'
    }

    this.__STARS__.forEach((it, k) => {
      it.setAttribute('is', k < i ? 'star-full' : 'star')
      it.setAttribute('color', k < i ? this.props.color : 'grey')
    })

    if (f > 0) {
      this.__STARS__[i].setAttribute('is', _last)
      this.__STARS__[i].setAttribute('color', this.props.color)
    }

    // 缓存结果
    this.props.tmp = { i, f }

    if (i === 0 && f === 0) {
      this.__TEXT__.textContent = ''
    } else {
      if (this.props.text.length === 5) {
        this.__TEXT__.textContent = this.props.text[i]
      } else {
        if (this.props['show-value']) {
          this.__TEXT__.textContent = i + f
        }
      }
    }
  }

  connectedCallback() {
    $.catch(this.__BOX__, 'mousemove', ev => {
      if (this.props.disabled) {
        return
      }
      if (ev.target.tagName === 'WC-ICON') {
        let idx = +ev.target.dataset.idx
        this._updateDraw(idx, +(ev.offsetX / this.props.starSize).toFixed(1))
      }
    })

    $.catch(this.__BOX__, 'click', ev => {
      var { tmp, disabled } = this.props
      if (disabled) {
        return
      }
      if (ev.target.tagName === 'WC-ICON') {
        this.props.value = tmp.i + tmp.f
        this.dispatchEvent(new CustomEvent('input'))
      }
    })

    $.catch(this.__BOX__, 'mouseleave', ev => {
      if (this.props.disabled) {
        return
      }
      this._updateDraw(-1)
    })
  }

  attributeChangedCallback(name, old, val) {
if (val === null || old === val) {return}
    switch (name) {
      case 'size':
        this.props.starSize = this.__STARS__[0].clientWidth
        break

      case 'allow-half':
      case 'show-value':
      case 'disabled':
        this.props[name] = true
        break

      case 'color':
        if (val) {
          this.props.color = val
        }
        break

      case 'text':
        if (val) {
          val = val.split('|')
          if (val.length === 5) {
            this.props.text = val.map(it => it.trim())
          }
        }
        break

      case 'value':
        this.value = val
        break
    }
  }
}


if(!customElements.get('wc-star')){
  customElements.define('wc-star', Star)
}
