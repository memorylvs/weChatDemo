var app = getApp();

Page({
  data:{
    apiHost: app.store.apiHost,
    type: '',    // 0: 藏品，1：拍品
    page:1,
    productData:[],
  },
  onLoad:function(options){
    this.setData({
      type: options.type,
    });

    this.loadProductData();
  },
  loadProductData:function(){
    var obj = this;
    let url;

    if (obj.data.type == 0) {
      url = "/ncollect/nproduct";
    } else {
      url = "/ncollect/nauction";
    }

    wx.request({
      url: app.store.apiHost + url,
      method:'post',
      data: {
        nfans_id: app.store.userInfo.id,
        page: obj.data.page,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var data = res.data.data;

        obj.setData({
          productData: obj.data.productData.concat(data),
        });
      },
    });
  },
  removeFavorites: function (e) {
    var obj = this;
    var productid = e.currentTarget.dataset.productid;

    wx.showModal({
      title: '提示',
      content: '你确认移除吗',
      success: function (res) {

        res.confirm && wx.request({
          url: app.store.apiHost + '/ncollect/add',
          method: 'post',
          data: {
            nfans_id: app.store.userInfo.id,
            productid: productid,
            type: obj.data.type,
          },
          header: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          success: function (res) {
            wx.redirectTo({
              url: '../user/shoucang?type=' + obj.data.type,
            })
          },
        });
      }
    });
  },
});