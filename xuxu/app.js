//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    var that=this
    var user=wx.getStorageSync('user')||{};
    var userInfo = wx.getStorageSync('userInfo') || {};
    if ((!user.openid || (user.expires_in || Date.now()) < (Date.now() + 600))){
        wx.login({
          success:function(res){
            if (res.code){
              wx.getUserInfo({
                success:function(res){
                  var objz={};
                  objz.avatarUrl=res.userInfo.avatarUrl;
                  objz.nickName=res.userInfo.nickName;
                  wx.setStorageSync('userInfo',objz);
                }
              });
              var d=that.globalData;
              var l = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.AppID + '&secret=' + d.AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code';
              wx.request({
                url:l,
                data:{},
                method:'GET',
                success:function(res){
                  var obj={};
                  obj.session_key=res.data.session_key;
                  obj.openid=res.data.openid;
                  obj.expires_in=res.data.expires_in;
                  wx.setStorageSync('user', obj);
                }
              });
            }else{
            }
          }
        });
    }

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null,
    AppID: 'wxaf35825c9a1af4d0',
    AppSecret: 'd363ab74887c3f80c48e44fbd6497d10',
  }
})