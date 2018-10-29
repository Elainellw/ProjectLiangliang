// pages/start/start.js
const app=getApp()

Page({
  data: {
    defaultSize:'default',
    plain:true,
    number_sentences:'',
    sentences:'',
    tableNameKeyWord: '',
    tableNameSentence: ''
  },
  
  formSubmit1:function(e){
    var that = this;
    console.log('input sentence: '+e.detail.value.nextKeyWord)
    wx.request({
      url: 'http://localhost:8084/insert',
      data: {
        tableNameKeyWord: that.data.tableNameKeyWord,
        tableNameSentence: that.data.tableNameSentence,
        sentence1:e.detail.value.inputSentence,
        nextKeyWord:e.detail.value.nextKeyWord
      },
      method:'POST',
      header: { 'content-type': 'application/json;charset=UTF-8' },          success: function (res) {
        console.log(res)
        that.onLoad()
      },
    })
  },

  // getKeyWords: function (e) {
  //   var that = this;
  //   wx.request({
  //     url: 'http://localhost:8082',
  //     data: {},
  //     header: { 'content-type': 'application/json' }, success: function (res) {
  //       that.setData({
  //         keyWords1: res.data[0].person,
  //         keyWords2: res.data[0].do,
  //         keyWords3: res.data[0].ppp,
  //       })
  //       console.log(res)
  //     }
  //   })
  // },

  // rendering whole story
  onShow: function (options)
  {
    var that = this;
    wx.request({
      url: 'http://localhost:8084/show?tableNameKeyWord=' + that.options.tableNameKeyWord,
      data: {},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        that.setData({
          number_sentences: res.data.length,
          sentences: res.data
        })
      }
    });
    that.setData({
      tableNameKeyWord:that.options.tableNameKeyWord,
      tableNameSentence:that.options.tableNameSentence
     })
  },

  onLoad: function (options) {
    
    wx.showShareMenu({
      withShareTicket:true
    });

    // app.userInfoReadyCallback = res => {
    //   wx.request({
    //     url: 'http://localhost:8084/show',
    //     data: {},
    //     method: 'GET',
    //     header: { 'content-type': 'application/json' },
    //     success: function (res) {
    //       console.log(res.data)
    //       var that = this;
    //       that.setData({
    //         number_sentences: res.data.length,
    //         sentences: res.data
    //       })
    //     }
    //   })
    // }
  }
})