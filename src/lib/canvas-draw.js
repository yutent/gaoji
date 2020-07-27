/**
 * canvas渲染
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/07/27 11:34:59
 */

'use strict'

const log = console.log

Anot.directive('draw', {
  priority: 1500,
  init(binding) {
    var elem = binding.element
    var ctx = elem.getContext('2d')
    binding.$ctx = ctx
  },
  update: function(val) {
    var list = val.$model
    var start = list.shift()
    var x = 0

    this.$ctx.clearRect(0, 0, 70, 30)
    this.$ctx.fillStyle = '#a7a8ab'
    this.$ctx.fillRect(0, 0, 1, 30)
    this.$ctx.fillRect(0, 29, 70, 1)

    this.$ctx.beginPath()
    this.$ctx.strokeStyle = '#ff5061'
    this.$ctx.lineWidth = 1
    this.$ctx.moveTo(0, 30 - start.h)

    while (list.length) {
      start = list.shift()
      x += 2
      this.$ctx.lineTo(x, 30 - start.h)
    }
    this.$ctx.stroke()
  }
})
