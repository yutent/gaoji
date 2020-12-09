/**
 * 托盘
 * @author yutent<yutent.io@gmail.com>
 * @date 2019/01/21 20:42:07
 */

'use strict'

const { Tray } = require('electron')
const path = require('path')
const ROOT = __dirname

module.exports = function(win) {
  win.__TRAY__ = new Tray(path.join(ROOT, '../images/tray.png'))

  win.__TRAY__.on('click', _ => {
    var b = win.__TRAY__.getBounds()
    win.setBounds({ x: b.x - 150, y: b.y + b.height + 4 })
    win.show()
    win.focus()
  })
}
