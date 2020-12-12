/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 *
 */

const RED = '#ff5061'
const GREEN = '#4caf50'
const BLUE = '#64b5f6'
const GREY = '#bdbdbd'
const PLAIN = '#f2f5fc'
const DARK = '#62778d'

export default class Rank extends HTMLElement {
  static get observedAttributes() {
    return ['stat']
  }

  props = {
    stat: {}
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
  display: flex; }

canvas {
  width: 680px;
  height: 100px; }
</style>
  <canvas></canvas>
`

    this.__SCENE__ = this.root.children[1]
    this.__CTX__ = this.__SCENE__.getContext('2d')
    this.__SCENE__.width = 680
    this.__SCENE__.height = 100
  }

  draw() {
    var { rank, e1, e3, e6, e12, cm, cp } = this.props.stat
    var ctx = this.__CTX__
    var x = 32

    while (rank.length < 60) {
      rank.unshift(0)
    }

    ctx.clearRect(0, 0, 680, 101)

    ctx.font = '10px Arial'
    ctx.textAlign = 'right'
    ctx.fillStyle = RED
    ctx.fillText('10%', 28, 10)
    ctx.fillText('5%', 28, 30)
    ctx.fillStyle = GREEN
    ctx.fillText('-5%', 28, 80)
    ctx.fillText('-10%', 28, 100)

    ctx.font = '10px menlo,Hiragino Sans GB'
    ctx.textAlign = 'left'
    ctx.fillStyle = DARK
    ctx.fillText('60天红绿榜', 160, 10)

    ctx.font = '12px menlo,Hiragino Sans GB'
    ctx.fillText(`最近1个月收益:  ${e1}%`, 360, 25)
    ctx.fillText(`最近3个月收益:  ${e3}%`, 360, 45)
    ctx.fillText(`最近半年收益:  ${e6}%`, 528, 25)
    ctx.fillText(`最近一年收益:  ${e12}%`, 528, 45)

    ctx.fillStyle = cp > 0 ? RED : cp === 0 ? GREY : GREEN
    ctx.fillRect(360, 65, 140, 20)
    ctx.fillRect(526, 65, 140, 20)
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 14px menlo,Hiragino Sans GB'
    ctx.fillText(`实时净值: ¥${cm}`, 364, 80)
    ctx.fillText(`实时涨跌: ${cp}%`, 532, 80)

    ctx.fillStyle = PLAIN
    ctx.fillRect(28, 25, 320, 1)
    ctx.fillRect(28, 75, 320, 1)
    ctx.fillStyle = GREY
    ctx.fillRect(28, 0, 1, 140)
    ctx.fillRect(0, 50, 348, 1)

    while (rank.length) {
      var n = rank.shift()
      var y = Math.ceil(50 - (n / 10) * 50)

      ctx.fillStyle = n > 0 ? RED : GREEN

      if (y > 50) {
        ctx.fillRect(x, 50, 3, y - 50)
      } else {
        ctx.fillRect(x, y, 3, 50 - y)
      }

      x += 5
    }
  }

  attributeChangedCallback(name, old, val) {
    if (val === null || old === val) {
      return
    }
    switch (name) {
      case 'stat':
        try {
          var stat = JSON.parse(val)
          this.props.stat = stat
          this.removeAttribute('stat')
          this.draw()
        } catch (e) {}
        break
    }
  }
}

if (!customElements.get('wc-rank')) {
  customElements.define('wc-rank', Rank)
}
