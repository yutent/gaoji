/**
 * {sonist app}
 *
 * @format
 * @author yutent<yutent@doui.cc>
 * @date 2018/12/16 17:15:57
 */

import '/lib/anot.js'
// import '/lib/request/index.js'

import layer from '/lib/layer/index.js'
import Utils from '/lib/utils.js'

const log = console.log

const { remote, ipcRenderer } = require('electron')

const WIN = remote.getCurrentWindow()

const $doc = Anot(document)

Anot({
  $id: 'app',
  state: {
    list: []
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
      // this.focus = false
      // this.btns.min = this.btns.close = BTNS_DICT.grey
    })

    // WIN.on('focus', _ => {
    //   this.focus = true
    //   this.btns.min = BTNS_DICT.min
    //   this.btns.close = BTNS_DICT.close
    // })

    this.getTodayStat('006736')
  },
  methods: {
    getTodayStat(id) {
      var res = ipcRenderer.sendSync(
        'net',
        `https://fundgz.1234567.com.cn/js/${id}.js`
      )
      // `http://fund.eastmoney.com/f10/F10DataApi.aspx?type=lsjz&code=006736`
      log(res)
      // fetch(`https://fundgz.1234567.com.cn/js/${id}.js`).then(res => {
      //   log(res)
      // })
    }
  }
})
