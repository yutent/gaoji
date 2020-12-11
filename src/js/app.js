/**
 * {sonist app}
 *
 * @format
 * @author yutent<yutent@doui.cc>
 * @date 2018/12/16 17:15:57
 */

import '/lib/anot.js'
import '/lib/form/button.js'
import '/lib/scroll/index.js'
import '/lib/chart/rank.js'
import '/lib/canvas-draw.js'

import layer from '/lib/layer/index.js'
import Utils from '/lib/utils.js'

const log = console.log

const { ipcRenderer } = require('electron')

// http://fund.eastmoney.com/pingzhongdata/161725.js?v=20201209153939

const $doc = Anot(document)

function getJsonp(str) {
  if (~str.indexOf('jsonpgz')) {
    return new Function(`function jsonpgz(d){return d}; return ${str}`)()
  }
  return false
}

function getTableData(str) {
  var match = str.match(/<tbody[^]*?>.*?<\/tbody>/)
  var table = document.createElement('table')
  var list = []
  var max = 0
  var min = 99

  table.innerHTML = match[0]
  list = Array.from(table.children[0].children)
    .map(it => {
      let m = +it.children[2].textContent
      if (m > max) {
        max = m
      }
      if (m < min) {
        min = m
      }
      return { m }
    })
    .reverse()

  list.forEach(it => {
    it.h = +(((it.m - min) * 60) / (max - min)).toFixed(2)
  })
  return list
}

Anot({
  $id: 'app',
  state: {
    curr: {
      code: '161725',
      name: '招商中证白酒指数分级',
      last60: [
        1.56,
        2.81,
        0.82,
        -0.18,
        -1.67,
        -2.34,
        1.36,
        -1.52,
        -0.92,
        -0.49,
        -1.74,
        0.03,
        1.15,
        -0.21,
        0.46,
        1.45,
        5.54,
        1.7,
        -0.33,
        -0.11,
        -1.11,
        -0.76,
        3.16,
        0.32,
        1.85,
        -2.54,
        -1.08,
        0.91,
        3.27,
        2.84,
        -2.83,
        1.67,
        1.1,
        0.48,
        1.89,
        -0.66,
        1.91,
        2.15,
        0.12,
        1.75,
        -3.43,
        3.88,
        -1.37,
        -1.62,
        0.38,
        1.49,
        1.03,
        0.6,
        -3.51,
        0.5,
        0.6,
        -3.01,
        0.87,
        -0.03,
        0.99,
        3.4,
        0.32,
        1.53,
        -0.46,
        0.84
      ].join(',')
    },
    list: [],
    $dict: {}
  },

  watch: {
    'chapter.content'() {
      this.calcuteWords = this.chapter.content.length
    },
    currCate() {
      this.renderChapterList()
    }
  },
  mounted() {
    // WIN.on('blur', _ => {
    //   WIN.hide()
    // })

    var watch_list = Anot.ls('watch_list') || '[]'

    watch_list = JSON.parse(watch_list)

    this.list = watch_list

    for (let it of this.list) {
      this.$dict[it.code] = it
    }
  },
  methods: {
    close() {
      // WIN.close()
    },
    getTodayStat(id) {
      var res = ipcRenderer.sendSync(
        'net',
        `https://fundgz.1234567.com.cn/js/${id}.js`
      )

      return getJsonp(res)
    },

    getLastMonth(id) {
      var res = ipcRenderer.sendSync(
        'net',
        `https://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&per=42&code=${id}`
      )
      return getTableData(res)
    },

    addGay() {
      layer
        .prompt('请输入鸡精代号', (val, done) => {
          if (val.trim()) {
            done()
          }
        })
        .then(id => {
          if (this.$dict[id]) {
            return
          }
          Anot.nextTick(_ => {
            var info = this.getTodayStat(id)
            var last
            if (info) {
              last = this.getLastMonth(id)
              var tmp = {
                code: info.fundcode,
                name: info.name,
                yesterday: info.dwjz,
                curr: info.gsz,
                percent: +info.gszzl,
                last
              }
              this.list.unshift(tmp)
              this.$dict[tmp.code] = this.list[0]
              Anot.ls('watch_list', this.list.$model)
            } else {
              layer.toast('鸡精不存在', 'error')
            }
          })
        })
        .catch(Anot.noop)
    },

    updateGay(item) {
      var info = this.getTodayStat(item.code)
      if (info.dwjz !== item.yesterday) {
        item.yesterday = info.dwjz
        item.last = this.getLastMonth(item.code)
      }
      item.curr = info.gsz
      item.percent = +info.gszzl
    },

    removeGay(item) {
      layer
        .confirm(`是否移除[${item.name.slice(0, 5)}...]?`)
        .then(_ => {
          item.$ups.it.$remove()
          delete this.$dict[item.code]
          Anot.ls('watch_list', this.list.$model)
        })
        .catch(Anot.noop)
    },

    updateGays() {
      for (let it of this.list) {
        this.updateGay(it)
      }

      this.list.sort((a, b) => {
        return b.percent - a.percent
      })

      Anot.ls('watch_list', this.list.$model)
    }
  }
})
