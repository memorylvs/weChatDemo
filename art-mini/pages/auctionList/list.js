var app = getApp();
Page({
  data: {
    apiHost: app.store.apiHost,
    auctionInfo: {},
    listInfo: [],       //拍卖品列表
    auctionId: 0,
    page: 1,
  },

  onLoad: function (option) {
    var obj = this;
    obj.setData({
       auctionId: option.nauction_id,
    });
    
    // 当前拍卖公司信息
    wx.request({
      url: app.store.apiHost + '/nauction/info',
      method: 'GET',
      data: {
        id: obj.data.auctionId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        obj.setData({
          auctionInfo: res.data.data,
        })
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });

    // 拍品信息
    wx.request({
      url: app.store.apiHost + '/nauctionitem/index',
      method: 'GET',
      data: {
        auction_id: obj.data.auctionId,
        page: obj.data.page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var arr = obj.data.listInfo;
        res.data.data.map((item) => {
          arr.push(item);
        })
        obj.setData({
          listInfo: arr,
        })
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  //点击加载更多
  getMore: function (e) {
    var obj = this;

    obj.setData({
      page: obj.data.page + 1,
    });

    wx.request({
      url: app.store.apiHost + '/nauctionitem/index',
      method: 'get',
      data: {
        auction_id: obj.data.auctionId,
        page: obj.data.page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var arr = [];
        if (res.data.data.length !== 0) {
          obj.setData({
            lisInfo: obj.data.lisInfo.concat(res.data.data),
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
})