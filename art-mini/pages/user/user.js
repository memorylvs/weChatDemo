var app = getApp()

Page( {
  data: {
    userInfo: {},
    msgShow: false,
    // orderInfo:{},  //订单的信息
  },
  onLoad: function () {
    var obj = this

    obj.setData({
      userInfo: app.store.userInfo,
    })

    this.loadOrderStatus();

    // 消息显示
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

        for (const element of data) {
          if (element.readtime == 0) {
            // console.log(element);
            obj.setData({
              msgShow: true,
            });
          }
        }
      },
    });
  },
  onShow:function(){
    this.loadOrderStatus();
  },
  loadOrderStatus:function(){
    //获取用户订单数据
    // var that = this;
    // wx.request({
    //   url: app.d.ceshiUrl + '/Api/User/getorder',
    //   method:'post',
    //   data: {
    //     userId:app.d.userId,
    //   },
    //   header: {
    //     'Content-Type':  'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     //--init data        
    //     var status = res.data.status;
    //     if(status==1){
    //       var orderInfo = res.data.orderInfo;
    //       that.setData({
    //         orderInfo: orderInfo
    //       });
    //     }else{
    //       wx.showToast({
    //         title: '非法操作.',
    //         duration: 2000
    //       });
    //     }
    //   },
    //   error:function(e){
    //     wx.showToast({
    //       title: '网络异常！',
    //       duration: 2000
    //     });
    //   }
    // });
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
  }
})
