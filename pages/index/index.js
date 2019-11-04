//index.js
//获取应用实例
const emotion = require('../../utils/emotion')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msgInput: '',
    expressionArr: [],
    expressionList: false,

    windowWidth: '',      //可使用屏幕的宽度
    windowHeight: '',      //可使用屏幕的高度
    scrollWidth: '',       //聊天内容scroll的高度
    scrollHeight: '',       //聊天内容scroll的宽度 
    baseHeight: '',        //初始化的高度
    keyboardInterval: 0,    //input的光标到键盘的距离
    isFocus: false,          //聚焦状态

    msgList: [
      {
        fromName: false,
        toName: true,
        msg: '预览图片的列表自己处理',
        msgType: 'text',
      },
      {
        fromName: true,
        toName: false,
        msg: '图片的大小自己设置',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '输入框用的是textarea',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '大部分逻辑都调用了监听底部高度，从而改变聊天内容的高度',
        msgType: 'text',
      },
      {
        fromName: true,
        toName: false,
        msg: '至于发送的时间，情况不同，处理也不同',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '需要配合socket',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '具体根据情况进行优化',
        msgType: 'text',
      },
      {
        fromName: true,
        toName: false,
        msg: '测试用的V',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '测试用的VI',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '哈哈哈',
        msgType: 'text',
      },
      {
        fromName: true,
        toName: false,
        msg: '？？？？',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '可以的',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msg: '测试用的IV',
        msgType: 'text',
      },
      {
        fromName: false,
        toName: true,
        msgImg: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3980008857,4202710523&fm=58',
        msgType: 'img'
      }
    ],
    scrollView: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getStystemInfo()
    // console.log("sasasa", emotion.default.emotion_map)
    var emotion_map = emotion.default.emotion_map;
    var expressionArr = []
    for (let i in emotion_map) {
      expressionArr.push({ img: emotion.default.emotionParser(i), code: i })
    }
    // console.log('expressionArr',expressionArr)
    this.setData({
      motto: emotion.default.emotionParser('Hello World! /::>'),
      expressionArr: expressionArr
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getBottomQuery()
    this.getInputQuery()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.setData({ scrollView:'scroll12'})

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /*
    获取系统的一个信息
  */
  getStystemInfo: function () {
    var stystemInfo = wx.getSystemInfoSync()
    console.log("stystemInfo.windowHeight", stystemInfo.windowHeight)
    this.setData({
      windowWidth: stystemInfo.windowWidth,
      windowHeight: stystemInfo.windowHeight,
      scrollHeight: stystemInfo.windowHeight,
      scrollWidth: stystemInfo.windowWidth,
    })
  },

  // 获取行数(随时监听，更新scroll-vie的高度)
  getTextLine: function (event) {
    console.log('此处监听的是textare的行数', event)
    this.getBottomQuery()
  },
  // 监听textarea的内容是否有值
  watchMsgInput: function (e) {
    this.setData({ msgInput: e.detail.value })
  },
  // 显示下方的表情包
  showExpression: function () {
    var _this = this
    this.setData({ expressionList: !this.data.expressionList })
    setTimeout(() => {
      _this.getBottomQuery()
    }, 250)
  },
  // 点击表情
  getExpresionCode: function (e) {
    console.log(e)
    var expcode = e.currentTarget.dataset.expcode;
    this.setData({ msgInput: this.data.msgInput + expcode })
  },
  // 发送内容
  sendMsg: function () {
    var data = {
      fromName: true,
      toName: false,
      msg: this.data.msgInput,
      msgType:'text',
    }
    var msgList = this.data.msgList
    var scrollView = 'scroll' + (msgList.length + 1)
    msgList.push(data)
    this.setData({
      msgList: msgList,
      msgInput: '',
    })
    this.scrollToBottom()
  },
  // 隐藏表情菜单
  noneExpMenu: function () {
    this.setData({ expressionList: false })
    this.scrollToBottom()
  },

  // 获取底部节点
  getBottomQuery: function () {
    var _this = this;
    var bottomQuery = wx.createSelectorQuery();
    bottomQuery.select('#bottom_Menu').boundingClientRect()
    bottomQuery.selectViewport().scrollOffset()
    bottomQuery.exec(function (res) {
      console.log("获取底部节点", res)
      _this.setData({
        scrollHeight: res[0].top - 10,
        baseHeight: res[0].top - 10
      })
      _this.scrollToBottom()
    })
  },
  // 动态滚动到底部
  scrollToBottom: function () {
    var _this = this;
    var msgList = _this.data.msgList;
    var scrollView = 'scroll' + (msgList.length - 1)
    setTimeout(() => {
      _this.setData({ scrollView: scrollView })
    }, 200)
  },
  // 获取textarea到底部（解决真机上，键盘弹出时，底部会出现黑色的区域）
  getInputQuery: function () {
    var _this = this;
    var inputQuery = wx.createSelectorQuery();
    inputQuery.select('#textinput').boundingClientRect()
    inputQuery.selectViewport().scrollOffset()
    inputQuery.exec(function (res) {
      console.log('获取textarea节点', res[1].scrollHeight - res[0].bottom)
      _this.setData({
        keyboardInterval: res[1].scrollHeight - res[0].bottom
      })
    })
  },
  // 点击textarea(这是用于解决表情列表和键盘冲突的BUG)
  clickTextarea: function () {
    var _this = this;
    if (_this.data.expressionList) {
      _this.setData({
        expressionList: false,
      })
      setTimeout(() => {
        _this.setData({
          isFocus: true
        })
        _this.getBottomQuery()
      }, 200)
    }
  },
  // 选择图片
  showMenu: function () {
    var _this = this;
    wx.chooseImage({
      count:1,
      success: function(res) {
        var data = {
          fromName: false,
          toName: true,
          msgImg: res.tempFilePaths[0],
          msgType: 'img'
        }
        var msgList = _this.data.msgList;
        msgList.push(data)
        _this.setData({
          msgList: msgList
        })
        _this.scrollToBottom()
      },
    })
    
  }

})
