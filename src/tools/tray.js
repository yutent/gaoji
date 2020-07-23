/**
 * 托盘
 * @author yutent<yutent.io@gmail.com>
 * @date 2019/01/21 20:42:07
 */

'use strict'

const { app, Tray } = require('electron')
const path = require('path')
const ROOT = __dirname

module.exports = function(win) {
  app.__TRAY__ = new Tray(path.join(ROOT, '../images/tray.png'))

  app.__TRAY__.on('click', _ => {
    var b = app.__TRAY__.getBounds()
    win.setBounds({ x: b.x - 185, y: b.y + b.height + 4 })
    win.show()
  })
}
