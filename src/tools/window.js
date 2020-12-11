/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 14:57:49
 */

const { BrowserWindow } = require('electron')

const createMenu = require('./menu')
const createTay = require('./tray')

/**
 * 应用主窗口
 */
exports.createMainWindow = function(icon) {
  var win = new BrowserWindow({
    title: '搞基数据',
    width: 1024,
    height: 540,
    frame: false,
    titleBarStyle: 'hiddenInset',
    resizable: false,
    maximizable: false,
    icon,
    transparent: true,
    vibrancy: 'hud',
    visualEffectState: 'active',
    webPreferences: {
      // webSecurity: false,
      experimentalFeatures: true,
      nodeIntegration: true,
      spellcheck: false
    },
    show: false
  })

  // 然后加载应用的 index.html。

  win.loadURL('app://local/index.html')

  // createAppTray(win)
  // ctrlTrayBtn(win)
  // createLrcTray(win)

  createMenu(win)

  win.on('ready-to-show', _ => {
    win.show()
    win.openDevTools()
  })

  win.on('close', ev => {
    ev.preventDefault()
    win.hide()
  })

  return win
}

// 创建悬浮窗口
exports.createFloatWindow = function() {
  var win = new BrowserWindow({
    width: 320,
    height: 360,
    resizable: false,
    maximizable: false,
    frame: false,
    // transparent: true,
    // hasShadow: false,
    show: false,
    vibrancy: 'hud',
    visualEffectState: 'active',
    webPreferences: {
      // webSecurity: false,
      experimentalFeatures: true,
      nodeIntegration: true,
      spellcheck: false
    }
  })

  // win.openDevTools()

  win.on('blur', ev => {
    win.hide()
  })

  createTay(win)
  win.loadURL('app://local/float.html')

  return win
}
