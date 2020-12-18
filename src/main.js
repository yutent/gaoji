/**
 *
 * @author yutent<yutent@doui.cc>
 * @date 2019/09/16 20:51:19
 */

const {
  app,
  BrowserWindow,
  protocol,
  ipcMain,
  net,
  Notification
} = require('electron')
const path = require('path')
const fs = require('iofs')

const { createMainWindow, createFloatWindow } = require('./tools/window')
const createMenu = require('./tools/menu')
const createTay = require('./tools/tray')

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

var timer

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

function ring() {
  var n = 5
  var t = setInterval(() => {
    var notify = new Notification({
      title: '搞基⏰',
      subtitle: '神奇的2点半到啦',
      body: '神奇的2点半到啦, 该加仓的加仓, 该卖的卖啦'
    })
    notify.show()
    n--
    if (n === 0) {
      clearInterval(t)
    }
  }, 1000)
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
  app.__main__ = createMainWindow(path.resolve(ROOT, './images/app.png'))
  app.__float__ = createFloatWindow()

  createMenu(app.__main__)
  createTay(app.__float__, app.__main__)

  app.__main__.on('closed', () => {
    app.__main__ = null
    app.__float__ = null
    app.exit()
  })

  // mac专属事件,点击dock栏图标,可激活窗口
  // app.on('activate', _ => {
  //   if (app.__main__) {
  //     app.__main__.restore()
  //   }
  // })
})

ipcMain.on('app', (ev, conn) => {
  switch (conn.type) {
    case 'fetch':
      fetch(conn.data).then(r => {
        ev.returnValue = r
      })
      break

    case 'notify':
      clearTimeout(timer)
      var t1 = Date.now()
      var t2 = new Date()
      t2.setHours(14)
      t2.setMinutes(0)
      t2.setSeconds(0)

      if (t2.getTime() - t1 > 0) {
        timer = setTimeout(ring, t2.getTime() - t1)
      }

      ev.returnValue = true
      break

    case 'data-reload':
      app.__main__.webContents.send('app', { type: 'data-reload', data: null })
      ev.returnValue = true
      break

    case 'devtools':
      app.__main__.openDevTools()
      ev.returnValue = true
      break
  }
})
