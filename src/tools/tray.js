/**
 * 托盘
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:30:20
 */

const { Tray } = require('electron')
const path = require('path')
const ROOT = __dirname

module.exports = function(win) {
  win.__TRAY__ = new Tray(path.join(ROOT, '../images/tray.png'))

  win.__TRAY__.on('click', _ => {
    var b = win.__TRAY__.getBounds()
    win.setBounds({ x: b.x - 120, y: b.y + b.height })
    win.show()
    win.focus()
    win.webContents.send('app', { type: 'float-visible', data: null })
  })
}
