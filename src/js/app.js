/**
 * {sonist app}
 *
 * @format
 * @author yutent<yutent@doui.cc>
 * @date 2018/12/16 17:15:57
 */

import '/lib/anot.js'
import '/lib/form/button.js'
import '/lib/form/switch.js'
import '/lib/scroll/index.js'
import '/lib/chart/rank.js'
import '/lib/chart/line.js'

import layer from '/lib/layer/index.js'
import Utils from '/lib/utils.js'

import app from '/lib/socket.js'

const log = console.log

function getJsonp(str) {
  if (~str.indexOf('jsonpgz')) {
    return new Function(`function jsonpgz(d){return d}; return ${str}`)()
  }
  return false
}

function getLineStat(str) {
  str = str.replace(
    /.*var syl_1n(.*?)var Data_netWorthTrend([^;]*?);.*/,
    'var syl_1n$1var Data_netWorthTrend$2;'
  )
  return new Function(`${str}; return {line: Data_netWorthTrend.map(it => ({
    x: ~~(it.x/1000),
    y: +(it.y * 10000).toFixed(0),
    p: it.equityReturn
  })), e1: +syl_1y, e3: +syl_3y, e6: +syl_6y, e12: +syl_1n}`)()
}

function sleep(ms) {
  return new Promise(_ => setTimeout(_, ms))
}

window.app = app

Anot({
  $id: 'app',
  state: {
    input: '',
    curr: {
      code: '',
      name: '',
      stat: '',
      line: ''
    },
    list: [],
    $dict: {},
    loading: false,
    preferences: {
      tab: 1,
      notify: Anot.ls('notify') === '1'
    }
  },

  watch: {
    'preferences.notify'(v) {
      Anot.ls('notify', v ^ 0)
      if (v) {
        app.dispatch('notify')
      }
    }
  },

  mounted() {
    var old = this.syncOldStat()

    if (old === false) {
      this.reloadGays()
    }

    if (this.preferences.notify) {
      app.dispatch('notify')
    }

    app.on('data-reload', data => {
      this.reloadGays()
    })
  },
  methods: {
    reloadGays() {
      var gays = Anot.ls('gays') || '{}'
      var list = []
      gays = JSON.parse(gays)

      for (let code in gays) {
        let { name, cm, cp, t } = gays[code]
        list.push({ code, name, cm, cp, t: t || 0 })
        this.$dict[code] = 1
      }
      list.sort((a, b) => b.cp - a.cp)

      this.list = list
    },

    syncOldStat() {
      var old = Anot.ls('watch_list')
      var list = []
      var dict = {}

      if (old) {
        old = JSON.parse(old)
        for (let it of old) {
          dict[it.code] = {
            name: it.name,
            cm: +it.curr,
            cp: it.percent,
            t: Date.now()
          }
          list.push({ code: it.code, ...dict[it.code] })
        }

        list.sort((a, b) => b.cp - a.cp)
        this.list = list

        Anot.ls('gays', dict)
        Anot.ls('watch_list', null)
        return true
      }
      return false
    },

    showPreferencesPanel() {
      this.$refs.pre.show()
    },

    switchTab(n) {
      this.preferences.tab = n
    },

    getGayStat(id) {
      var res = app.dispatch(
        'fetch',
        `https://fundgz.1234567.com.cn/js/${id}.js`
      )

      return getJsonp(res)
    },

    addGay() {
      var code = this.input
      var gay

      if (this.$dict[code]) {
        layer.toast('这个鸡精在列表呢~~~', 'warn')
        this.input = ''
        return
      }

      if (code === 'debug') {
        this.input = ''
        return app.dispatch('devtools')
      }

      if (code.length < 6) {
        return
      }

      if (/[^\d]/.test(code)) {
        layer.toast('只能通过鸡精编号添加', 'error')
        this.input = ''
        return
      }

      gay = this.getGayStat(code)

      if (gay) {
        let tmp = {
          code: gay.fundcode,
          name: gay.name,
          cm: +gay.gsz,
          cp: +gay.gszzl,
          t: Date.now()
        }
        this.input = ''
        this.list.push(tmp)
        this.$dict[tmp.code] = 1
        this.list.sort((a, b) => b.cp - a.cp)
        this.saveCache()
      } else {
        layer.toast('鸡精不存在', 'error')
      }
    },

    async updateGays() {
      var { code, stat } = this.curr

      this.loading = true
      for (let it of this.list) {
        //
        let info = this.getGayStat(it.code)
        let time, needUpdate

        if (!info) {
          console.log(it)
          continue
        }

        it.cm = +info.gsz
        it.cp = +info.gszzl

        time = new Date(info.gztime.slice(0, 10) + ' 00:00:00')
        time = ~~(time.getTime() / 1000) - 24 * 3600

        // 如果走势最后的日期比当前最新的小, 则全量更新
        if (it.t < time) {
          it.t = time
          needUpdate = this.updateLine(it.code)
        }

        if (it.code === code) {
          stat = JSON.parse(stat)
          stat.cm = it.cm
          stat.cp = it.cp
          if (needUpdate) {
            stat.rank = needUpdate.line.slice(-60).map(_ => _.p)
            stat.e1 = needUpdate.e1
            stat.e3 = needUpdate.e3
            stat.e6 = needUpdate.e6
            stat.e12 = needUpdate.e12
            this.curr.line = JSON.stringify(needUpdate.line)
          }
          this.curr.stat = JSON.stringify(stat)
        }
        await sleep(500)
      }
      //
      this.loading = false
      Anot.ss('last_update', Date.now())
      layer.toast('数据更新成功', 'success')
      this.list.sort((a, b) => b.cp - a.cp)
      this.saveCache()
    },

    removeGay() {
      var { code, name } = this.curr
      layer
        .confirm(`是否移除「${name}」?`)
        .then(_ => {
          for (let it of this.list) {
            if (it.code === code) {
              this.list.remove(it)
              delete this.$dict[code]
              Anot.ls(code, null)
              this.saveCache()
              break
            }
          }
          this.viewGay(this.list[0])
        })
        .catch(Anot.noop)
    },

    saveCache() {
      var dict = {}
      for (let it of this.list) {
        var { code, name, cm, cp, t } = it
        dict[code] = { name, cm, cp, t }
      }
      Anot.ls('gays', dict)
    },

    updateLine(code) {
      var gay = app.dispatch(
        'fetch',
        `http://fund.eastmoney.com/pingzhongdata/${code}.js?v=${Date.now()}`
      )
      gay = getLineStat(gay)
      Anot.ls(code, JSON.stringify(gay))
      return gay
    },

    viewGay(item) {
      var gay = Anot.ls(item.code)
      var rank, line
      var { cm, cp, t } = item

      this.curr.code = item.code
      this.curr.name = item.name

      if (gay) {
        gay = JSON.parse(gay)
        var last = gay.line[gay.line.length - 1].x
        if (last < t) {
          gay = null
        }
      }

      if (!gay) {
        gay = this.updateLine(item.code)
        item.t = gay.line[gay.line.length - 1].x
        this.saveCache()
      }

      rank = gay.line.slice(-60).map(_ => _.p)
      line = JSON.stringify(gay.line)

      this.curr.stat = JSON.stringify({
        rank,
        e1: gay.e1,
        e3: gay.e3,
        e6: gay.e6,
        e12: gay.e12,
        cm,
        cp
      })
      this.curr.line = line
    }
  }
})
