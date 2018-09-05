var app = getApp();
Page({
  data: {
    apiHost: app.store.apiHost,
    info: [],
    url: '',
    id: '',
  },

  onLoad: function (option) {
    var obj = this;
    if (option.sort === "1") { // 藏品信息
      obj.setData({
        url: app.store.apiHost + '/norderproduct/info',
        id: option.id,
      });
    } else if (option.sort === "2") {  // 拍品信息
      obj.setData({
        url: app.store.apiHost + '/norderitem/info',
        id: option.id,
      });
    }
    // 当前信息
    wx.request({
      url: obj.data.url,
      method: 'GET',
      data: {
        id: obj.data.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // console.log(res);
        obj.setData({
          info: res.data.data,
        })
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  }
})