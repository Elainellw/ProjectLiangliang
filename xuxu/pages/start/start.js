// pages/start/start.js
Page({
  data: {
    inputValue:'',
    defaultSize:'default',
    plain:true,
    keyWord1:'',
    keyWord:'小明',
  },
  bindKeyInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  formSubmit1:function(e){
    var that = this;
    wx.request({
      url: 'http://localhost:8083',
      data: {
        sentence1:e.detail.value.inputSentence1
      },
      method:'POST',
      header: { 'content-type': 'application/json;charset=UTF-8' },          success: function (res) {
        console.log(res)
      },
    })
  },
  sentence2: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  sentence3: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  getKeyWords:function(e){
    var that=this;
    wx.request({
      url: 'http://localhost:8082',
      data: { },
      header: { 'content-type': 'application/json' },           success: function (res) {
        that.setData({
          keyWords1:res.data[0].person,
          keyWords2:res.data[0].do,
          keyWords3:res.data[0].ppp,
        })
        console.log(res)
      }
    })
  },

  onLoad: function (options) {
    this.setData({
      keyWord1: options.keyWord1
    });
    console.log('First key word:'+this.data.keyWord1);

    wx.showShareMenu({
      withShareTicket:true
    });
  }
})