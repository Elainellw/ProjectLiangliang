// pages/start/start.js
const app=getApp()

Page({
  data: {
    inputValue:'',
    defaultSize:'default',
    plain:true,
    number_sentences:'',
    sentences:'',
    trytry:[
      {sentence:1},
      {sentence:2}, 
      {sentence:3},
    ]
  },
  bindKeyInput:function(e){
    this.setData({
      inputValue: e.detail.value
    })
  },
  
  formSubmit1:function(e){
    var that = this;
    console.log('input sentence: '+e.detail.value.nextKeyWord)
    wx.request({
      url: 'http://localhost:8084/insert',
      data: {
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
  // rendering whole story
  onShow: function ()
  {
    var that = this;
    wx.request({
      url: 'http://localhost:8084/show',
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