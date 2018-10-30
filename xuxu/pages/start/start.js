// pages/start/start.js
const app=getApp()

Page({
  data: {
    defaultSize:'default',
    plain:true,
    sentences:'',
    tableName: '',
    count:0,
    writerid:'',
    keyWord:''
  },
  
  formSubmit1:function(e){
    var that = this;
    if (e.detail.value.inputSentence.includes(that.data.keyWord)){
        that.data.count+=1;
        console.log('input sentence: '+e.detail.value.nextKeyWord)
        wx.request({
          url: 'http://localhost:8084/insert',
          data: {
            tableName: that.data.tableName,
            writerid:that.data.writerid,                    
            sentence1:e.detail.value.inputSentence,
            nextKeyWord:e.detail.value.nextKeyWord
          },
          method:'POST',
          header: { 'content-type': 'application/json;charset=UTF-8' },         success: function (res) {
              if (res.data=='inserted'){
                console.log('new sentence inserted!');
                that.onShow();  //是否可以替换为直接修改sentences?
              }else if (res.data=='repetitive'){
                console.log(res);
                wx.showModal({
                  title: '提示',
                  content: '请不要连续输入哦',
                  showCancel: false,
                });
              }
          },
        })
    }else{
        wx.showModal({
          title:'提示',
          content:'输入的句子需包含关键字',
          showCancel:false,
        })
    }
  },

    // onShareAppMessage: function (res) {
    //   var that=this;
    //   if(res.from === 'button') {
    //   //来自邀请好友按钮
    //   return{
    //     title:'邀请好友续写'
    //     path:'pages/start/start?tableName='+
    //   }
    //    console.log(res.target)
    //    }
    //   return {
 
    //   }
    // },


  // rendering whole story
  onShow: function (options)
  {
    var that = this;
    wx.request({
      url: 'http://localhost:8084/show?tableName=' + that.options.tableName,
      data: {},
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log(res.data)
        var tempSentences=[];
        var i = 0
        for(i=0;i<res.data.length-1;i++){
          tempSentences[i]=res.data[i];
        }
        // retrieve the last item
        if(res.data.length>0&&res.data[0]!=null){
          var tempKeyword = res.data[i];
          that.setData({
            sentences: tempSentences,
            keyWord: tempKeyword.keyWord
          });
        }else{
          that.setData({
            sentences: tempSentences,
            keyWord: app.globalData.userInfo.nickName
          });
        }
      }
    });

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
    }).then (function(res)
    {
      var idUrl = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + app.globalData.AppID + '&secret=' + app.globalData.AppSecret + '&js_code=' + res.code + '&grant_type=authorization_code';
      wx.request
        ({
          url: idUrl,
          data: { code: res.code },
          success: function (res) {
            console.log(res.data);
            that.setData({writerid:res.data.openid})
          },
          fail: function (err) {
            var msg = 'authorize wechat user info failed';
          }
        });
    }
    )

    that.setData({
      tableName:that.options.tableName
     })
  },

  onLoad: function (options) { 
    wx.showShareMenu({
      withShareTicket:true
    });
  }
})