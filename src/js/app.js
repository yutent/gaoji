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
  return new Function(`${str}; return {line: Data_netWorthTrend.map(it => ({
    x: ~~(it.x/1000),
    y: +(it.y * 10000).toFixed(0),
    p: it.equityReturn
  })), e1: +syl_1y, e3: +syl_3y, e6: +syl_6y, e12: +syl_1n}`)()
}

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
    var gays = Anot.ls('gays') || '{}'
    var list = []
    var old = this.syncOldStat()

    if (old === false) {
      gays = JSON.parse(gays)

      for (let code in gays) {
        let { name, cm, cp, t } = gays[code]
        list.push({ code, name, cm, cp, t })
        this.$dict[code] = 1
      }
      list.sort((a, b) => b.cp - a.cp)

      this.list = list
    }

    if (this.preferences.notify) {
      app.dispatch('notify')
    }
  },
  methods: {
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

    updateGay() {
      var { code, stat } = this.curr
      var info = this.getGayStat(code)

      for (let it of this.list) {
        if (it.code === code) {
          let d

          it.cm = +info.gsz
          it.cp = +info.gszzl

          this.list.sort((a, b) => b.cp - a.cp)

          d = new Date(info.gztime.slice(0, 10) + ' 00:00:00')
          d = ~~(d.getTime() / 1000) - 24 * 3600

          // 如果走势最后的日期比当前最新的小, 则全量更新
          if (it.t < d) {
            Anot.ls(code, null)
            this.viewGay(it)
            console.log('update all stat...')
            return
          }

          stat = JSON.parse(stat)
          stat.cm = it.cm
          stat.cp = it.cp
          this.curr.stat = JSON.stringify(stat)

          this.saveCache()
          layer.toast('数据更新成功', 'success')
          Anot.ss('last_update', Date.now())

          return
        }
      }
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
        gay = app.dispatch(
          'fetch',
          `http://fund.eastmoney.com/pingzhongdata/${
            item.code
          }.js?v=${Date.now()}`
        )
        gay = getLineStat(gay)
        item.t = gay.line[gay.line.length - 1].x
        this.saveCache()
        Anot.ls(item.code, JSON.stringify(gay))
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
