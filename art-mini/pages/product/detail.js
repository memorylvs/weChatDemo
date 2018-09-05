var app = getApp();

//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');

Page({
  data:{
    apiHost: app.store.apiHost,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banners: [],    //轮播图
    productInfo: {},       //产品详情
    productId: 0,   //当前的产品id
    winWidth: 0,    //屏幕宽度
    winHeight: 0,   //屏幕高度
    currentTab: 0,  //tab切换, 图文详情/产品参数
    buynum: 1,      //购买的数量
    isCollect: 0,   //当前产品是否已收藏
  },
  onLoad: function (option) {
    var obj = this;
    //获取系统信息
    wx.getSystemInfo({
      success: function (res) {
        obj.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    //设置当前的产品id
    obj.setData({
      productId: option.productId,
    });

    //设置当前的产品信息
    wx.request({
      url: app.store.apiHost + '/nproduct/info',
      method: 'post',
      data: {
        id: obj.data.productId,
        nfans_id: app.store.userInfo.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var response = res.data.data;
        var content = response.content;

        WxParse.wxParse('content', 'html', content, obj, 3);
        
        var banners = new Array();

        banners.push(response.banner_1_image);
        banners.push(response.banner_2_image);
        banners.push(response.banner_3_image);
        banners.push(response.banner_4_image);
        banners.push(response.banner_5_image);
        banners.push(response.banner_6_image);

        obj.setData({
          productInfo: response,
          banners: banners,
        });
        if (obj.data.productInfo.iscollect === 1) {
          obj.setData({
            isCollect: 1,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  bindChange: function (e) {//滑动切换tab 
    this.setData({ currentTab: e.detail.current });
  },
  swichNav: function (e) {//点击tab切换
    var that = this;
    if (that.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  addFavorites: function (e) {
    var obj = this;
    if (app.isAuthority()) {
      wx.request({
        url: app.store.apiHost + '/ncollect/add',
        method: 'get',
        data: {
          nfans_id: app.store.userInfo.id,
          productid: obj.data.productId,
          type: 0,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          var data = res.data;
          if (data.code == 1) {
            wx.showToast({
              title: '添加收藏成功！',
              duration: 2000
            });
            obj.setData({isCollect: 1});
          } else if (data.code == 0) {
            wx.showToast({
              title: '删除收藏成功！',
              duration: 2000
            });
            obj.setData({ isCollect: 0 });
          } else {
            wx.showToast({
              title: data.err,
              duration: 2000
            });
          }
        },
        fail: function () {
          // fail
          wx.showToast({
            title: '网络异常！',
            duration: 2000
          });
        }
      });
    } else {
      app.reinitAuthorize();
    }
  },
  // addShopCart: function (e) { //添加到购物车
  //   var that = this;
  //   wx.request({
  //     url: app.d.ceshiUrl + '/Api/Shopping/add',
  //     method: 'post',
  //     data: {
  //       uid: app.d.userId,
  //       pid: that.data.productId,
  //       num: that.data.buynum,
  //     },
  //     header: {
  //       'Content-Type': 'application/x-www-form-urlencoded'
  //     },
  //     success: function (res) {
  //       // //--init data        
  //       var data = res.data;
  //       if (data.status == 1) {
  //         var ptype = e.currentTarget.dataset.type;
  //         if (ptype == 'buynow') {
  //           wx.redirectTo({
  //             url: '../order/pay?cartId=' + data.cart_id
  //           });
  //           return;
  //         } else {
  //           wx.showToast({
  //             title: '加入购物车成功',
  //             icon: 'success',
  //             duration: 2000
  //           });
  //         }
  //       } else {
  //         wx.showToast({
  //           title: data.err,
  //           duration: 2000
  //         });
  //       }
  //     },
  //     fail: function () {
  //       // fail
  //       wx.showToast({
  //         title: '网络异常！',
  //         duration: 2000
  //       });
  //     }
  //   });
  // },
  setModalStatus: function (e) {
    if (app.isAuthority()) {
      // 弹窗
      var animation = wx.createAnimation({
        duration: 200,
        timingFunction: "linear",
        delay: 0
      })

      this.animation = animation
      animation.translateY(300).step();
      
      this.setData({
        animationData: animation.export()
      })

      if (e.currentTarget.dataset.status == 1) {
        this.setData(
          {
            showModalStatus: true
          }
        );
      }
      setTimeout(function () {
        animation.translateY(0).step()
        this.setData({
          animationData: animation
        })
        if (e.currentTarget.dataset.status == 0) {
          this.setData(
            {
              showModalStatus: false
            }
          );
        }
      }.bind(this), 200)
    } else {
      app.reinitAuthorize();
    }
  },
  // 加减
  // changeNum:function  (e) {
  //   if (e.target.dataset.alphaBeta == 0) {
  //     if (this.data.buynum <= 1) {
  //       buynum:1
  //     }else{
  //       this.setData({
  //         buynum:this.data.buynum - 1
  //       })
  //     };
  //   }else{
  //     this.setData({
  //       buynum:this.data.buynum + 1
  //     })
  //   };
  // },
});
