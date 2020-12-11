/**
 *
 * @author yutent<yutent.io@gmail.com>
 * @date 2020/12/10 19:53:05
 */

import '/lib/anot.js'
import '/lib/form/button.js'
import '/lib/scroll/index.js'
import '/lib/canvas-draw.js'

import layer from '/lib/layer/index.js'
import Utils from '/lib/utils.js'
import app from '/lib/socket.js'

const log = console.log

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
    var watch_list = Anot.ls('watch_list') || '[]'

    watch_list = JSON.parse(watch_list)

    this.list = watch_list

    for (let it of this.list) {
      this.$dict[it.code] = it
    }

    app.on('float-visible', data => {
      var time = +Anot.ss('last_update') || 0
      var now = Date.now()
      // 如果离上次更新超过15分钟, 则自动更新
      if (now - time > 15 * 60 * 1000) {
        this.updateGays()
        Anot.ss('last_update', now)
      }
    })
  },
  methods: {
    close() {
      // WIN.close()
    },
    getTodayStat(id) {
      var res = app.dispatch(
        'fetch',
        `https://fundgz.1234567.com.cn/js/${id}.js`
      )

      return getJsonp(res)
    },

    getLastMonth(id) {
      var res = app.dispatch(
        'fetch',
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
