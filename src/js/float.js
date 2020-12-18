/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:53:05
 */

import '/lib/anot.js'

import '/lib/scroll/index.js'
import layer from '/lib/layer/index.js'
import app from '/lib/socket.js'

function getJsonp(str) {
  if (~str.indexOf('jsonpgz')) {
    return new Function(`function jsonpgz(d){return d}; return ${str}`)()
  }
  return false
}

Anot({
  $id: 'app',
  state: {
    list: []
  },
  mounted() {
    this.reloadGays()

    app.on('float-visible', data => {
      var time = +Anot.ss('last_update') || 0
      var now = Date.now()

      // 有触发小窗口显示时, 更新通知提醒
      if (Anot.ls('notify') === '1') {
        app.dispatch('notify')
      }

      this.reloadGays()
      setTimeout(() => {
        // 如果离上次更新超过15分钟, 则自动更新
        if (now - time > 15 * 60 * 1000) {
          this.updateGays()
          Anot.ss('last_update', now)
        }
      }, 500)
    })
  },
  methods: {
    reloadGays() {
      var gays = Anot.ls('gays') || '{}'
      var list = []

      gays = JSON.parse(gays)

      for (let code in gays) {
        let { name, cm, cp, t } = gays[code]
        list.push({ code, name, cm, cp, t })
      }
      list.sort((a, b) => b.cp - a.cp)

      this.list = list
    },

    getGayStat(id) {
      var res = app.dispatch(
        'fetch',
        `https://fundgz.1234567.com.cn/js/${id}.js`
      )
      return getJsonp(res)
    },

    updateGay(item) {
      var info = this.getGayStat(item.code)
      item.cm = +info.gsz
      item.cp = +info.gszzl
    },

    updateGays() {
      for (let it of this.list) {
        this.updateGay(it)
      }
      this.list.sort((a, b) => b.cp - a.cp)
      this.saveCache()
      app.dispatch('data-reload')
    },
    saveCache() {
      var dict = {}
      for (let it of this.list) {
        var { code, name, cm, cp, t } = it
        dict[code] = { name, cm, cp, t }
      }
      Anot.ls('gays', dict)
    }
  }
})
