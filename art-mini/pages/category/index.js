//获取应用实例
var app = getApp();

Page({
  data: {
    apiHost: app.store.apiHost,
    levelOneCategories: [],   //第1级分类
    sonCategories: [],        //第1级分类的子类别
    currentCategoryId: 0,     //当前类别的id
  },
  onLoad: function (option){
    var obj = this;

    wx.request({
      url: app.store.apiHost + '/ncategory/firstlevel',
      method:'post',
      data: {},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        obj.setData({
          levelOneCategories: res.data.data,
          currentCategoryId: res.data.data[0].id,
        });

        wx.request({
          url: app.store.apiHost + '/ncategory/secondlevel?pid=' + obj.data.currentCategoryId,
          success: function (res) {
            obj.setData({
              sonCategories: res.data.data,
            })
          }
        })
      },
      error:function(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      },
    });
  },
  tapType: function (e){
    var obj = this;
    const clickCategoryId = e.currentTarget.dataset.typeId;

    obj.setData({
      currentCategoryId: clickCategoryId
    });

    wx.request({
      url: app.store.apiHost + '/ncategory/secondlevel',
      method:'post',
      data: {
        pid: clickCategoryId,
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {
        obj.setData({
          sonCategories: res.data.data,
        });
      },
      error:function(e){
        wx.showToast({
          title:'网络异常！',
          duration:2000,
        });
      }
    });
  },
})