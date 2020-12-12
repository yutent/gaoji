/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 *
 */

import $ from '../utils.js'
import '../form/button.js'

const DARK = '#62778d'
const BLUE = '#64b5f6'
const PLAIN = '#f2f5fc'

export default class Line extends HTMLElement {
  static get observedAttributes() {
    return ['list']
  }

  props = {
    list: []
  }

  state = {
    key: 1,
    list: []
  }

  constructor() {
    super()

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
  display: flex;
  width: 680px; }

.container {
  position: relative;
  padding: 24px 0 0; }

canvas {
  width: 680px;
  height: 230px; }

section {
  position: absolute;
  right: 0;
  top: 0; }
</style>
  <div class="container">
    <canvas></canvas>
    <section>
      <wc-button color="blue" data-key="1" size="mini">1月</wc-button>
      <wc-button data-key="3" size="mini">3月</wc-button>
      <wc-button data-key="6" size="mini">半年</wc-button>
      <wc-button data-key="12" size="mini">1年</wc-button>
      <wc-button data-key="36" size="mini">3年</wc-button>
      <wc-button data-key="999" size="mini">所有</wc-button>
    </section>
  </div>
`

    var elem = this.root.children[1]
    this.__SCENE__ = elem.firstElementChild
    this.__FILTER__ = elem.lastElementChild
    this.__CTX__ = this.__SCENE__.getContext('2d')
    this.__SCENE__.width = 680
    this.__SCENE__.height = 230
  }

  _getTime(n) {
    var now = new Date()
    var time = { getTime: _ => 0 }
    var Y = now.getFullYear()
    var m = now.getMonth()
    var d = now.getDate()

    switch (n) {
      case 1:
        time = new Date(Y, m - 1, d, 0, 0, 0)
        break
      case 3:
        time = new Date(Y, m - 3, d, 0, 0, 0)
        break
      case 6:
        time = new Date(Y, m - 6, d, 0, 0, 0)
        break
      case 12:
        time = new Date(Y - 1, m, d, 0, 0, 0)
        break
      case 36:
        time = new Date(Y - 3, m, d, 0, 0, 0)
        break
    }
    return time.getTime()
  }

  _filter(n) {
    if (n < 999) {
      var time = this._getTime(n)
      this.state.list = this.props.list.filter(it => it.x >= time)
    } else {
      this.state.list = this.props.list.concat()
    }
  }

  draw() {
    var { list, key } = this.state
    var ctx = this.__CTX__
    var x = 36
    var max = 0
    var min = Number.MAX_SAFE_INTEGER
    var step = 0 // 纵坐标间隔
    var dis = +(640 / list.length).toFixed(2) || 1 // 横坐标间隔
    var point
    var p1, p2, p3, p4
    var format = key > 12 ? 'Y/m' : 'm/d'

    for (let it of list) {
      if (max < it.y) {
        max = it.y
      }
      if (min > it.y) {
        min = it.y
      }
    }

    min = ~~(min / 100)
    max = Math.ceil(max / 100)
    step = ~~((max - min) / 3)

    p1 = Math.floor(list.length / 4)
    p2 = Math.floor(list.length / 2)
    p3 = Math.floor((list.length * 3) / 4)
    p4 = list.length - 1

    ctx.clearRect(0, 0, 680, 230)

    // 纵坐标数值
    ctx.font = '12px Arial'
    ctx.textAlign = 'right'
    ctx.fillStyle = DARK
    ctx.fillText(min / 100, 32, 205)
    ctx.fillText((min + step) / 100, 32, 155)
    ctx.fillText((min + step + step) / 100, 32, 105)
    ctx.fillText((min + step + step + step) / 100, 32, 55)

    ctx.font = '10px Arial'
    ctx.textAlign = 'left'
    ctx.fillText(new Date(list[0].x).format(format), x - 12, 225)
    ctx.fillText(new Date(list[p1].x).format(format), x + dis * p1 - 12, 225)
    ctx.fillText(new Date(list[p2].x).format(format), x + dis * p2 - 12, 225)
    ctx.fillText(new Date(list[p3].x).format(format), x + dis * p3 - 12, 225)
    ctx.fillText(
      new Date(list[p4].x).format(format),
      x + dis * p4 - 12 - (key > 12 ? 24 : 4),
      225
    )

    // x轴参考线
    ctx.fillStyle = PLAIN
    ctx.fillRect(x, 50, 648, 1)
    ctx.fillRect(x, 100, 648, 1)
    ctx.fillRect(x, 150, 648, 1)
    ctx.fillRect(x, 200, 648, 1)

    // y轴参考 线
    ctx.fillRect(x, 0, 1, 210)
    ctx.fillRect(x + dis * p1, 0, 1, 210)
    ctx.fillRect(x + dis * p2, 0, 1, 210)
    ctx.fillRect(x + dis * p3, 0, 1, 210)
    ctx.fillRect(x + dis * p4, 0, 1, 210)

    point = list.shift()

    // 曲线
    ctx.beginPath()
    ctx.strokeStyle = BLUE
    ctx.lineWidth = 1
    ctx.moveTo(x, 200 - (((point.y / 100 - min) / step) * 50).toFixed(0))

    while (list.length) {
      let y

      point = list.shift()

      y = 200 - (((point.y / 100 - min) / step) * 50).toFixed(0)
      x += dis

      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }

  connectedCallback() {
    $.bind(this.__FILTER__, 'click', ev => {
      var el = ev.target
      if (this.props.list.length < 1) {
        return
      }
      if (el.tagName === 'WC-BUTTON') {
        var k = +el.dataset.key

        $.each(this.__FILTER__.children, function(it) {
          it.removeAttribute('color')
        })
        el.setAttribute('color', 'blue')

        this.state.key = k
        this._filter(k)
        this.draw()
      }
    })
  }

  attributeChangedCallback(name, old, val) {
    if (val === null || old === val) {
      return
    }
    switch (name) {
      case 'list':
        try {
          var list = JSON.parse(val)
          list.forEach(it => (it.x = it.x * 1000))
          this.props.list = list
          this._filter(this.state.key)
          this.removeAttribute('list')
          this.draw()
        } catch (e) {}
        break
    }
  }
}

if (!customElements.get('wc-line')) {
  customElements.define('wc-line', Line)
}
