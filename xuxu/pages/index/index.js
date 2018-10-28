//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '论信仰',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    plain: true,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //进入开始新页面
  startNewOne: function () {
    var that = this;
    wx.login({
      success:function(res){
        console.log('获取登陆code:'+ res.code)
        if (res.code){
          var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.AppID + '&secret=' + app.globalData.AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code';
    wx.request({
      url: l,
      data: {code:res.code},
       success: function (res) {
        console.log(res.data);
        wx.request({
          url: 'http://localhost:8084/start',
          method:'POST',
          data:{
            openid:res.data.openid,
            keyWord1:that.data.userInfo.nickName
            },
        })
      },
    })
    wx.navigateTo({
      url: '../start/start?keyWord1='+that.data.userInfo.nickName
      })
      }
      }
    })
  },
  
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
