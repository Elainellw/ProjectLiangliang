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
    tableNameKeyWord:'',
    tableNameSentence:''
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  //进入开始新页面
  startNewOne: function () 
  {
      var that = this;
      new Promise(function(resolve,reject)
      {


        wx.login
        ({
          success: function (res) 
          {
            console.log('获取登陆code:' + res.code)
            if (res.code) 
            {
              resolve(res);
            }
            else
            {
              var msg = 'result code is not successful';
              reject(msg);
            }
          },
          fail: function (err)
          {
            var msg = 'failed logging in';
            reject(msg);
          }
        });
      })
      .then(function (res)
      {
        var idUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.AppID + '&secret=' + app.globalData.AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code';
        new Promise(function(resolve2, reject2)
        {
          wx.request
            ({
              url: idUrl,
              data: { code: res.code },
              success: function (res) 
              {
                console.log(res.data);
                resolve2(res);
              },
              fail: function (err)
              {
                var msg = 'authorize wechar user info failed';
                reject2(msg);
              }
            });
        }).then(function (res)
          {
            new Promise(function(resolve3, reject3)
            {
              wx.request
              ({
                url: 'http://localhost:8084/start',
                method: 'POST',
                data: 
                {
                  openid: res.data.openid,
                  keyWord1: app.globalData.userInfo.nickName
                },
                success: function (res) {
                  resolve3(res);
                  that.setData({
                    tableNameKeyWord:res.data[0],
                    tableNameSentence:res.data[1]
                  })
                  console.log('tableNameKeyWord:' + that.data.tableNameKeyWord)
                  console.log('tableNameSentence:' + that.data.tableNameSentence)
                }
              })
            }).then(function (res)
            {
              console.log('tableNameKeyWord:' + that.data.tableNameKeyWord)
              console.log('tableNameSentence:' + that.data.tableNameSentence)
              wx.navigateTo({
                url: '../start/start?tableNameKeyWord=' + that.data.tableNameKeyWord + '&tableNameSentence=' + that.data.tableNameSentence
              });
            });
    
      });
      }).catch(function (msg)
      {
        console.log(msg);
      });
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
  },
  
})
