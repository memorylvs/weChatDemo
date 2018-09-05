var app = getApp();

Page({
  data: {
    apiHost: app.store.apiHost,
    list: [],
    page: 1,
  },
  onLoad: function (options) {
    var obj = this;

    //拍卖会列表
    wx.request({
      url: app.store.apiHost + '/nauction/index',
      data: {
        page: obj.data.page
      },
      success: function (res) {
        obj.setData({
          list: res.data.data,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },
  getMore: function (e) {
    //点击加载更多
    var obj = this;

    obj.setData({
      page: obj.data.page + 1,
    });

    wx.request({
      url: app.store.apiHost + '/nauction/index',
      method: 'get',
      data: {
        page: obj.data.page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.data.length !== 0) {
          obj.setData({
            list: obj.data.list.concat(res.data.data),
          });
        } else {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },
});
