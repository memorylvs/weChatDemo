var app = getApp();

var WxParse = require('../../wxParse/wxParse.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apiHost: app.store.apiHost,
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    banners: [],    //轮播图
    info: {},
    productId: 0,
    winWidth: 0,    //屏幕宽度
    winHeight: 0,   //屏幕高度
    currentTab: 0,  //tab切换, 图文详情/产品参数
    isCollect: 0,
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
    obj.setData({
      productId: option.infoId,
    });
    wx.request({
      url: app.store.apiHost + '/nauctionitem/info',
      method: 'GET',
      data: {
        id: option.infoId,
        nfans_id: app.store.userInfo.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var response = res.data.data;
        var content = response.content
        var arr = [];
        arr.push(response);

        WxParse.wxParse('content', 'html', content, obj, 0);

        obj.setData({
          banners: arr,
          info: response,
        });

        // console.log(obj.data.info);
        
        if (obj.data.info.iscollect === 1) {
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
  // 添加收藏
  addFavorites: function (e) {
    if (app.isAuthority()) {
      var obj = this;
      wx.request({
        url: app.store.apiHost + '/ncollect/add',
        method: 'get',
        data: {
          nfans_id: app.store.userInfo.id,
          productid: obj.data.productId,
          type: 1,
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
            obj.setData({ isCollect: 1 });
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
})