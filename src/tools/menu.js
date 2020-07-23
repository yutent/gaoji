/**
 * 菜单项
 * @author yutent<yutent@doui.cc>
 * @date 2019/01/21 20:34:04
 */

'use strict'

const { Menu } = require('electron')

module.exports = function(win) {
  let menuList = Menu.buildFromTemplate([
    {
      label: '搞基数据',
      submenu: [
        { role: 'about', label: '关于搞基数据' },
        { type: 'separator' },
        { role: 'quit', label: '退出' }
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
