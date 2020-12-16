/**
 * 托盘
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:30:20
 */

const { Tray, Menu } = require('electron')
const path = require('path')
const ROOT = __dirname

module.exports = function(mini, main) {
  var menuList = Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click(a, b, ev) {
        main.restore()
      }
    },
    {
      label: '不搞基了',
      accelerator: 'Command+Q',
      click(a, b, ev) {
        main.destroy()
      }
    }
  ])
  var tray = new Tray(path.join(ROOT, '../images/tray.png'))

  tray.on('click', _ => {
    var b = tray.getBounds()
    mini.setBounds({ x: b.x - 120, y: b.y + b.height })
    mini.show()
    mini.focus()
    mini.webContents.send('app', { type: 'float-visible', data: null })
  })

  tray.on('right-click', _ => {
    tray.popUpContextMenu(menuList)
  })

  main.__tray__ = tray
}
