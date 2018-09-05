var app = getApp();
// pages/order/downline.js
Page({
  data: {
    nproduct_id: '',
    nauction_item_id: '',
    nfansId: '',
    openId: '',
    btnDisabled: false,
    nameValue: '',
    phoneValue: '',
    price: 0,
  },
  onLoad: function (options) {
    // console.log(options);
    if (options.nauction_item_id !== undefined) {
      this.setData({
        nauction_item_id: options.nauction_item_id,  // 拍品的id
        nfansId: app.store.userInfo.id,   // 粉丝的id
        price: parseFloat(options.total_fee),  // 总价
        openId: app.store.userInfo.openid,   // 粉丝的openid
      });
    } 
    if (options.nproduct_id !== undefined) {
      this.setData({
        nproduct_id: options.nproduct_id,  // 藏品的id
        nfansId: app.store.userInfo.id,   // 粉丝的id
        price: parseFloat(options.total_fee),  // 总价
        openId: app.store.userInfo.openid,   // 粉丝的openid
      });
    }
  },

  bindName: function (e) {
    this.setData({
      nameValue: e.detail.value
    })
  },

  bindPhone: function (e) {
    this.setData({
      phoneValue: e.detail.value
    })
  },
  
  //支付
  Pay: function () {
    var that = this;
    if (that.data.nameValue === '') {
      wx.showToast({
        title: '姓名不能为空!',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else if (that.data.phoneValue === '') {
      wx.showToast({
        title: '手机号不能为空!',
        icon: 'none',
        duration: 2000
      });
      return false;
    } else {
      that.setData({
        btnDisabled: true,
      });
      if (that.data.nauction_item_id) {
        //拍品，调起微信支付
        wx.request({
          url: app.store.apiHost + '/norderitem/add',
          data: {
            nauction_item_id: that.data.nauction_item_id,
            nfans_id: that.data.nfansId,
            total_fee: that.data.price * 100,
            openid: that.data.openId,
            contactname: that.data.nameValue,
            contactmobile: that.data.phoneValue,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }, // 设置请求的 header
          success: function (res) {
            if (res.data.code == 1) {
              var info = JSON.parse(res.data.data.pay_json);

              wx.requestPayment({
                timeStamp: info.timeStamp.toString(),
                nonceStr: info.nonceStr,
                package: info.package,
                signType: 'MD5',
                paySign: info.paySign,
                success: function (res) {
                  wx.showToast({
                    title: "支付成功!",
                    duration: 2000,
                  });
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../orderList/index?sort=2',
                    });
                  }, 2500);
                },
                fail: function(res) {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                      title: '您已取消支付',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: res.errMsg,
                      duration: 2000
                    })
                  }
                  
                  that.setData({
                    btnDisabled: false,
                  });
                }
              })
            } else {
              wx.showToast({
                title: '拍品下单失败',
                duration: 2000
              });
              that.setData({
                btnDisabled: false,
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！err:wxpay',
              duration: 2000
            });
            that.setData({
              btnDisabled: false,
            });
          }
        });
      }

      if (that.data.nproduct_id) {
        //藏品调起微信支付
        wx.request({
          url: app.store.apiHost + '/norderproduct/add',
          data: {
            nproduct_id: that.data.nproduct_id,
            nfans_id: that.data.nfansId,
            total_fee: that.data.price * 100,
            openid: that.data.openId,
            contactname: that.data.nameValue,
            contactmobile: that.data.phoneValue,
          },
          method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }, // 设置请求的 header
          success: function (res) {
            if (res.data.code == 1) {
              var info = JSON.parse(res.data.data.pay_json);
              
              wx.requestPayment({
                timeStamp: info.timeStamp.toString(),
                nonceStr: info.nonceStr,
                package: info.package,
                signType: 'MD5',
                paySign: info.paySign,
                success: function (res) {
                  wx.showToast({
                    title: "支付成功!",
                    duration: 2000,
                  });
                  setTimeout(function () {
                    wx.navigateTo({
                      url: '../orderList/index?sort=1',
                    });
                  }, 2500);
                },
                fail: function (res) {
                  if (res.errMsg == 'requestPayment:fail cancel') {
                    wx.showToast({
                      title: '您已取消支付',
                      duration: 2000
                    })
                  } else {
                    wx.showToast({
                      title: res.errMsg,
                      duration: 2000
                    })
                  }

                  that.setData({
                    btnDisabled: false,
                  });
                }
              })
            } else {
              wx.showToast({
                title: '藏品下单失败',
                duration: 2000
              });
              that.setData({
                btnDisabled: false,
              });
            }
          },
          fail: function () {
            // fail
            wx.showToast({
              title: '网络异常！err:wxpay',
              duration: 2000
            });
            that.setData({
              btnDisabled: false,
            });
          }
        })
      } 
    }
  },
});