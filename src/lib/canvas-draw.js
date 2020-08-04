/**
 * canvas渲染
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/07/27 11:34:59
 */

'use strict'

const log = console.log

const RED = '#ff5061'
const GREEN = '#4caf50'

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
    var end = list[list.length - 1]
    var x = 0

    this.$ctx.clearRect(0, 0, 128, 60)

    this.$ctx.fillStyle = '#a7a8ab'
    this.$ctx.fillRect(0, 29, 128, 1)

    this.$ctx.beginPath()
    this.$ctx.strokeStyle = start.m < end.m ? RED : GREEN
    this.$ctx.lineWidth = 2
    this.$ctx.moveTo(0, 60 - start.h)

    while (list.length) {
      start = list.shift()
      x += 3
      this.$ctx.lineTo(x, 60 - start.h)
    }
    this.$ctx.stroke()
  }
})
