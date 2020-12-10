/**
 * 菜单项
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:30:02
 */

const { Menu } = require('electron')

module.exports = function(win) {
  var menuList = Menu.buildFromTemplate([
    {
      label: '搞基数据',
      submenu: [
        { role: 'about', label: '关于搞基数据' },
        { type: 'separator' },
        {
          label: '退出',
          accelerator: 'Command+Q',
          click(a, b, ev) {
            win.destroy()
          }
        }
      ]
    },
    {
      label: '编辑',
      submenu: [
        { role: 'cut', label: '剪切' },
        { role: 'copy', label: '复制' },
        { role: 'paste', label: '粘贴' },
        { role: 'selectall', label: '全选' }
      ]
    }
  ])
  Menu.setApplicationMenu(menuList)
}
