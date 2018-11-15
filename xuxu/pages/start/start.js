// pages/start/start.js
const app=getApp()
var dest = app.globalData.Host.productUrl;

Page({
  data: {
    defaultSize:'default',
    plain:true,
    story:{},
    tableName: '',
    count:0,
    writerid:'',
    keyWord:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
  },
  
  formSubmit1:function(e){
    var that = this;
    console.log('data recieved from keyboard!')
    console.log('input sentence: ' + e.detail.value.inputSentence )
    console.log('input keyword: ' + e.detail.value.nextKeyWord)
    console.log('destination: '+dest)
    console.log('url:' + 'http://' + dest + ':80/insert')
    //get user id 
    new Promise(function (resolve, reject) {
      wx.login
        ({
          success: function (res) {
            console.log('获取参与者的登陆code:' + res.code)
            if (res.code) {
              resolve(res);
            }
            else {
              var msg = 'result code is not successful';
              reject(msg);
            }
          },
          fail: function (err) {
            var msg = 'failed logging in';
            reject(msg);
          }
        });
    }).then(function (res) {
      new Promise(function(resolve2,reject2){
          var idUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.AppID + '&secret=' + app.globalData.AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request
            ({
              url: idUrl,
              data: { code: res.code },
              success: function (res2) {
                resolve2(res2);
              },
              fail: function (err) {
                var msg2 = 'authorize wechat user info failed';
                reject2(msg2);
              }
            });
      }).then(function(res2){
              console.log('openid: '+res2.data.openid);
              that.setData({ writerid: res2.data.openid })
          if (e.detail.value.inputSentence.includes(that.data.keyWord)) {
            console.log('input sentence: ' + e.detail.value.nextKeyWord)
            console.log('table name pass to backend: ' + that.data.tableName)
            wx.request({
              url: 'http://' + dest + ':80/insert',
              data: {
                tableName: that.data.tableName,
                writerid: that.data.writerid,
                sentence1: e.detail.value.inputSentence,
                nextKeyWord: e.detail.value.nextKeyWord,
                nickName: that.data.userInfo.nickName,
                avatarUrl: that.data.userInfo.avatarUrl,
                count:that.data.count
              },
              method: 'POST',
              header: { 'content-type': 'application/json;charset=UTF-8' }, fail: function (err) {
                var errMessarge = JSON.stringify(err);
                console.log('failed')
                console.log('err message: ' + errMessarge)
              },
              success: function (res) {
                console.log('successfully connected to backend')
                if (res.data == 'inserted') {
                  console.log('new sentence inserted!');
                  var tempCount = that.data.count + 1;
                  that.setData({
                    count: tempCount
                  });
                  that.onShow();  //是否可以替换为直接修改sentences?
                } else if (res.data == 'repetitive') {
                  console.log(res);
                  wx.showModal({
                    title: '错误提示',
                    content: '请不要连续输入哦',
                    showCancel: false,
                  });
                }else if (res.data=='slow'){
                  console.log(res);
                  wx.showModal({
                    title: '错误提示',
                    content: '已经被别人抢先一步续写了',
                    showCancel: false,
                  });
                }
              },
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '输入的句子需包含关键字',
              showCancel: false,
            })
          }
        }).catch(function (msg2){
          console.log(msg2);
        })
    }).catch(function(msg){
      console.log(msg)
    })
  },

    onShareAppMessage: function (res) {
      var that=this;
      return{
        title:'邀请好友续写',
        path:'pages/start/start?tableName='+that.data.tableName
      }  
    },


  // rendering whole story
  onShow: function (options)
  {
    var that = this;
    //exhibit the existed story on show 
    wx.request({
      url: 'http://' + dest + ':80/show?tableName=' + that.options.tableName,
      data: {},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      fail:function(err){
        var errMessarge = JSON.stringify(err);
        console.log('failed')
        console.log('err message: ' + errMessarge)
      },
      success: function (res) {
        console.log(res.data)
        var tempStory=[];
        var i = 0
        for(i=0;i<res.data.length-1;i++){
          tempStory[i]=res.data[i];
        }
        // retrieve the last item
        if(res.data.length>0&&res.data[0]!=null){
          var tempKeyword = res.data[i];
          that.setData({
            story: tempStory,//story includes sentences, nickName and avatarUrl
            keyWord: tempKeyword.keyWord
          });
        }else{
          that.setData({
            story: tempStory,
            keyWord: app.globalData.userInfo.nickName,
            count:tempStory.length
          });
        }
      }
    });
  
    var detableName = decodeURIComponent(that.options.tableName)
    that.setData({
      tableName:detableName
     })
  },


  onLoad: function (options) { 
    wx.showShareMenu({
      withShareTicket:true
    });

    //获取头像和昵称
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
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