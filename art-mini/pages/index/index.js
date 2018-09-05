var app = getApp();

Page({
  data: {
    apiHost: app.store.apiHost,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    imgs: [],
    products: [],
    lots: [],
    list: [],
    currentProductPage: 1,
  },
  onLoad: function (options) {
    var obj = this;

    //轮播图
    wx.request({
      url: app.store.apiHost + '/nbanner/all',
      success: function (res) {
        obj.setData({
          imgs: res.data.data,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

    //藏品推荐
    wx.request({
      url: app.store.apiHost + '/nproduct/index',
      data: {
        category_id: 1,
        page: 1,
      },
      success: function (res) {
        obj.setData({
          products: res.data.data,
        })
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });

    //拍品推荐
    // wx.request({
    //   url: app.store.apiHost + '/nauctionitem/index',
    //   data: {
    //     auction_id: 2,
    //     page: 1,
    //   },
    //   success: function (res) {
    //     obj.setData({
    //       lots: res.data.data,
    //     })
    //   },
    //   fail: function (e) {
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   },
    // });
    //拍卖会列表
    wx.request({
      url: app.store.apiHost + '/nauction/index',
      data: {
        page: obj.data.currentProductPage
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
  

  onShareAppMessage: function () {
    return {
      title: '艺术品',
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  getMore: function (e) {
    //点击加载更多
    var obj = this;

    wx.request({
      url: app.store.apiHost + '/nproduct/index?category_id=1',
      method: 'post',
      data: {
        page: obj.data.currentProductPage + 1
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.data;

        if (!list.length) {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }

        obj.setData({
          currentProductPage: obj.data.currentProductPage + 1,
          products: obj.data.products.concat(list)
        });
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
