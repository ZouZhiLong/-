// components/msgContent/msgContent.js
const emotion = require('../../utils/emotion')
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isMySend: Boolean,
    msgType: String,
    msgContent: String,
    msgImage: String,
  },

  /** 
   * 数据监听器
   */
  observers: {
    'msgContent': function (msgContent) {
      this.setData({
        msgText: emotion.default.emotionParser(msgContent)
      })
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    msgText: ''
  },

  /**
   * 组件的方法列表
   */
  methods: {
    toPreviewImage: function (e) {
      // packingApi.$previewImg(this.data.msgImage, [this.data.msgImage,])
      wx.previewImage({
        urls: [this.data.msgImage,],
        current: this.data.msgImage
      })
    }
  }
})
