var app = getApp();

Page({
  data: {
    apiHost: app.store.apiHost,
    products: [],
    currentProductPage: 1,
    category_id: 0,
  },
  onLoad: function (options) {
    //更改头部标题
    wx.setNavigationBarTitle({
      title: options.category_name,
      success: function () {
      },
    });

    var obj = this;

    //获取当前类别的商品
    wx.request({
      url: app.store.apiHost + '/nproduct/index',
      method: 'post',
      data: {
        category_id: options.category_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        obj.setData({
          products: res.data.data,
          category_id: options.category_id,
        });
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    });
  },
  getMore: function (e) {
    //点击加载更多
    var obj = this;

    wx.request({
      url: app.store.apiHost + '/nproduct/index',
      method: 'post',
      data: {
        page: obj.data.currentProductPage + 1,
        category_id: obj.data.category_id,
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
    });
  },




  // showModal: function () {
  //     // 显示遮罩层
  //     var animation = wx.createAnimation({
  //       duration: 200,
  //       timingFunction: "linear",
  //       delay: 0
  //     })
  //     this.animation = animation
  //     animation.translateY(300).step()
  //     this.setData({
  //       animationData: animation.export(),
  //       showModalStatus: true
  //     })
  //     setTimeout(function () {
  //       animation.translateY(0).step()
  //       this.setData({
  //         animationData: animation.export()
  //       })
  //     }.bind(this), 200)
  // },
  // hideModal: function () {
  //   // 隐藏遮罩层
  //   var animation = wx.createAnimation({
  //   duration: 200,
  //   timingFunction: "linear",
  //   delay: 0
  //   })
  //   this.animation = animation
  //   animation.translateY(300).step()
  //   this.setData({
  //   animationData: animation.export(),
  //   })
  //   setTimeout(function () {
  //   animation.translateY(0).step()
  //   this.setData({
  //     animationData: animation.export(),
  //     showModalStatus: false
  //   })
  //   }.bind(this), 200)
  // },
})
