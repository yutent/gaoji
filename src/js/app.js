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

import layer from '/lib/layer/index.js'
import Utils from '/lib/utils.js'

const log = console.log

const { remote, ipcRenderer } = require('electron')

const WIN = remote.getCurrentWindow()

const $doc = Anot(document)

function getJsonp(str) {
  return new Function(`function jsonpgz(d){return d}; return ${str}`)()
}

function getTableData(str) {
  var match = str.match(/<tbody[^]*?>.*?<\/tbody>/)
  var table = document.createElement('table')
  var list = []
  var max = 0

  table.innerHTML = match[0]
  list = Array.from(table.children[0].children).map(it => {
    let m = +it.children[1].textContent
    if (m > max) {
      max = m
    }
    return { m }
  })
  max = Math.ceil(max)
  list.forEach(it => {
    it.h = ((100 * it.m) / max).toFixed(2) + '%'
  })
  return list
}

Anot({
  $id: 'app',
  state: {
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
    WIN.on('blur', _ => {
      WIN.hide()
    })

    var watch_list = Anot.ls('watch_list') || '[]'
    if (watch_list) {
      watch_list = JSON.parse(watch_list)
    }

    this.list = watch_list

    for (let it of this.list) {
      this.$dict[it.code] = it
    }
  },
  methods: {
    getTodayStat(id) {
      var res = ipcRenderer.sendSync(
        'net',
        `https://fundgz.1234567.com.cn/js/${id}.js`
      )
      return getJsonp(res)
    },

    getLastWeek(id) {
      var res = ipcRenderer.sendSync(
        'net',
        `https://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=${id}`
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
            var last = this.getLastWeek(id)
            if (info) {
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
            }
          })
        })
        .catch(Anot.noop)
    },

    updateGay(item) {
      var info = this.getTodayStat(item.code)
      if (info.dwjz !== item.yesterday) {
        item.last = this.getLastWeek(id)
      }
      item.curr = info.gsz
      item.percent = +info.gszzl

      Anot.ls('watch_list', this.list.$model)
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
    }
  }
})
