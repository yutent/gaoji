/**
 *
 * @authors yutent (yutent.io@gmail.com)
 * @date    2020-12-08 11:30:52
 * @version v1.0.0
 *
 */

const RED = '#ff5061'
const GREEN = '#4caf50'
const GREY = '#bdbdbd'
const PLAIN = '#f2f5fc'

export default class Rank extends HTMLElement {
  static get observedAttributes() {
    return ['list']
  }

  props = {
    list: ''
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
    var { list } = this.props
    var ctx = this.__CTX__
    var x = 32

    while (list.length < 60) {
      list.unshift(0)
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

    ctx.fillStyle = PLAIN
    ctx.fillRect(28, 25, 652, 1)
    ctx.fillRect(28, 75, 652, 1)
    ctx.fillStyle = GREY
    ctx.fillRect(28, 0, 1, 140)
    ctx.fillRect(0, 50, 680, 1)

    while (list.length) {
      var n = list.shift()
      var y = Math.ceil(50 - (n / 10) * 50)

      ctx.fillStyle = n > 0 ? RED : GREEN

      if (y > 50) {
        ctx.fillRect(x, 50, 3, y - 50)
      } else {
        ctx.fillRect(x, y, 3, 50 - y)
      }

      x += 10
    }
  }

  attributeChangedCallback(name, old, val) {
    if (val === null || old === val) {
      return
    }
    switch (name) {
      case 'list':
        var list = val.split(',')
        this.props.list = list.map(n => +n)
        this.removeAttribute('list')
        this.draw()
        break
    }
  }
}

if (!customElements.get('wc-rank')) {
  customElements.define('wc-rank', Rank)
}
