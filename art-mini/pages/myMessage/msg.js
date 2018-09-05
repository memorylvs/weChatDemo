var app = getApp();

//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data: {
    apiHost: app.store.apiHost,
    page: 1,
    msgData: [],
    currentData: {},
    showMsg: false,
  },
  onLoad: function (options) {
    var obj = this;

    wx.request({
      url: app.store.apiHost + '/nfansmsg/index',
      method: 'get',
      data: {
        nfans_id: app.store.userInfo.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;

        for (let i = 0; i < data.length; i++) {
          let element = data[i];
          WxParse.wxParse('content', 'html', data[i].content, obj, 3);
        }

        obj.setData({
          msgData: data,
        });
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  // 点击弹出消息详情
  viewMsg: function (e) {
    var obj = this;
    var id = parseInt(e.currentTarget.dataset.id, 10);
    for (const element of obj.data.msgData) {
      if (element.id === id) {
        obj.setData({
          currentData: element,
          showMsg: true,
        });
      }
    };
  },
  confirmMsg: function (e) {
    var obj = this;
    obj.setData({
      showMsg: false,
    });
    var msgId = e.currentTarget.dataset.id
    wx.request({
      url: app.store.apiHost + '/nfansmsg/hasread',
      method: 'get',
      data: {
        msg_id: msgId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.redirectTo({
          url: '../myMessage/msg',
        })
      },
    });
  },
  // 删除信息
  removeMsg: function (e) {
    var obj = this;
    var msgId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确认删除吗',

      success: function (res) {
        res.confirm && wx.request({
          url: app.store.apiHost + '/nfansmsg/del',
          method: 'get',
          data: {
            msg_id: msgId,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.redirectTo({
              url: '../myMessage/msg',
            })
          },
        });
      },
    });
  },
});