var app = getApp();
Page({
  data: {
    apiHost: app.store.apiHost,
    listData:[],
    collectState: false, //藏品的显示
    auctionState:false,   // 拍品的显示
    getMsg: false,
    url:'',
    page: 1,
  },

  onLoad: function (option) {
    var obj = this;
    
    if (option.sort === "1") { // 藏品
      obj.setData({
        url: app.store.apiHost + '/norderproduct/index',
        collectState: true,
      });
    } else if (option.sort === "2") {  // 拍品
      obj.setData({
        url: app.store.apiHost + '/norderitem/index',
        auctionState: true,
      });
    }
    // 当前信息
    wx.request({
      url: obj.data.url,
      method: 'GET',
      data: {
        nfans_id: app.store.userInfo.id,
        page: obj.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        obj.setData({
          listData: res.data.data,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  getMore: function() {
    var obj = this;

    obj.setData({
      page: obj.data.page + 1,
    })
    // 获取列表信息
    wx.request({
      url: obj.data.url,
      method: 'GET',
      data: {
        nfans_id: app.store.userInfo.id,
        page: obj.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log(res);
        if (res.data.data.length !== 0) {
          var data = res.data.data;
          obj.setData({
            listData: obj.data.listData.concat(data),
          })
        } else {
          wx.showToast({
            title: '已全部加载！',
            duration: 2000,
          });
          obj.setData({
            getMsg: true,
          })
        }
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