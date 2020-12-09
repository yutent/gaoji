/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2019/09/16 20:51:19
 */

const { app, BrowserWindow, protocol, ipcMain, net } = require('electron')
const path = require('path')
const fs = require('iofs')

const createMenu = require('./tools/menu')
const createTay = require('./tools/tray')

const log = console.log
const MIME_TYPES = {
  '.js': 'text/javascript',
  '.html': 'text/html',
  '.htm': 'text/plain',
  '.css': 'text/css',
  '.jpg': 'image/jpg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/ico'
}

const ROOT = __dirname

function fetch(url) {
  return new Promise((y, n) => {
    var conn = net.request(url)
    var r = []

    conn.on('response', res => {
      res.on('data', c => {
        r.push(c)
      })

      res.on('end', _ => {
        y(Buffer.concat(r).toString())
      })
    })

    conn.on('error', e => {
      n(e)
    })

    conn.end()
  })
}

/* ----------------------------------------------------- */
app.commandLine.appendSwitch('--lang', 'zh-CN')
app.commandLine.appendSwitch('--autoplay-policy', 'no-user-gesture-required')

protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

/* ----------------------------------------------------- */

app.dock.hide()

//  初始化应用
app.once('ready', () => {
  // 注册协议
  protocol.registerBufferProtocol('app', (req, cb) => {
    let file = req.url.replace(/^app:\/\/local\//, '')
    let ext = path.extname(req.url)
    let buff = fs.cat(path.resolve(ROOT, file))
    cb({ data: buff, mimeType: MIME_TYPES[ext] })
  })

  // 创建浏览器窗口
  let win = new BrowserWindow({
    title: '',
    width: 320,
    height: 360,
    resizable: false,
    maximizable: false,
    frame: false,
    transparent: true,
    hasShadow: false,
    // backgroundColor: '#80585858',
    // show: false,
    vibrancy: 'dark',
    visualEffectState: 'active',
    icon: path.resolve(ROOT, './images/app.png'),
    webPreferences: {
      // webSecurity: false,
      experimentalFeatures: true,
      nodeIntegration: true,
      spellcheck: false
    }
  })

  win.on('closed', () => {
    app.exit()
    win = null
  })

  // win.openDevTools()

  // 然后加载应用的 index.html
  win.loadURL('app://local/index.html')

  createMenu(win)
  createTay(win)
})

ipcMain.on('net', (ev, url) => {
  fetch(url).then(r => {
    ev.returnValue = r
  })
})
