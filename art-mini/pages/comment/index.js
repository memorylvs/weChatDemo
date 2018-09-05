var app = getApp();
Page({
  data: {
    apiHost: app.store.apiHost,
    list: [],       //评论的列表
    infoType: 1,   // 1，拍卖会 2，藏品 3，拍品
    id: 0,
    page: 1,
    isCommit: false,  //评论框显示
    commitEnable: false,// 提交按钮状态
    content: '',        // 评论的内容
    pid: 0,            // 评论的上级id
    pfans_nickname: '', // 评论的上级名称 
    rid: 0,            // 评论的根id
    getMsg: false,
    replyMsg: '请填写评论..',
  },

  onLoad: function (option) {
    var obj = this;
    if (option.nauction_id) {
      obj.setData({
        infoType: 1,
        id: option.nauction_id,
      });
    } else if (option.product_id) {
      obj.setData({
        infoType: 2,
        id: option.product_id,
      });
    } else if (option.auction_id) {
      obj.setData({
        infoType: 3,
        id: option.auction_id,
      });
    }
    obj.loadData(obj.data.infoTyep);
  },

  // 加载评论
  loadData: function(infoType) {
    wx.showLoading({
      title: '加载中',
    });
    var obj = this;
    if(obj.data.infoType === 1) {
      // 拍卖会的评论列表
      wx.request({
        url: app.store.apiHost + '/ncommentauction/index',
        method: 'GET',
        data: {
          nauction_id: obj.data.id,
          page: obj.data.page,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (Object.keys(res.data.data).length !== 0) {
            var comments = [];
            Object.keys(res.data.data).map((item) => {
              comments.push(res.data.data[item])
            });
            obj.setData({
              list: obj.data.list.concat(comments.reverse()),
            })
            wx.hideLoading();
          } else {
            wx.showToast({
              title: '评论已加载完毕',
              icon: 'none',
              duration: 2000,
            });
            obj.setData({
              getMsg: true,
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
    } else if (obj.data.infoType === 2) {
      // 藏品的评论列表
      wx.request({
        url: app.store.apiHost + '/ncommentproduct/index',
        method: 'GET',
        data: {
          nproduct_id: obj.data.id,
          page: obj.data.page,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (Object.keys(res.data.data).length !== 0) {
            var comments = [];
            Object.keys(res.data.data).map((item) => {
              comments.push(res.data.data[item])
            });
            obj.setData({
              list: obj.data.list.concat(comments.reverse()),
            })
            wx.hideLoading();
          } else {
            wx.showToast({
              title: '评论已加载完毕',
              icon: 'none',
              duration: 2000,
            });
            obj.setData({
              getMsg: true,
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
    } else if (obj.data.infoType === 3) {
      // 拍品的评论列表
      wx.request({
        url: app.store.apiHost + '/ncommentitem/index',
        method: 'GET',
        data: {
          nauction_item_id: obj.data.id,
          page: obj.data.page,
        },
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          if (Object.keys(res.data.data).length !== 0) {
            var comments = [];
            Object.keys(res.data.data).map((item) => {
              comments.push(res.data.data[item])
            });
            obj.setData({
              list: obj.data.list.concat(comments.reverse()),
            })
            wx.hideLoading();
          } else {
            wx.showToast({
              title: '评论已加载完毕',
              icon: 'none',
              duration: 2000,
            });
            obj.setData({
              getMsg: true,
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
    }
  },
  onReachBottom: function() {
    var obj = this;

    // 上拉加载
    setTimeout(() => {
      obj.getMore();
    });
  },
  bindTextAreaBlur: function (e) {
    this.setData({
      content: e.detail.value
    })
  },
  bindFormSubmit: function (e) {
    if (app.isAuthority()) {
      var obj = this;
      obj.setData({
        commitEnable: true,
        content: e.detail.value.textarea
      })
      if (e.detail.value.textarea.trim() === '') {
        wx.showToast({
          title: '输入内容不能为空',
          icon: 'none',
          duration: 2000
        });
        obj.setData({
          commitEnable: false,
        })
      } else {
        if (obj.data.infoType === 1) {    // 拍卖会
            wx.request({
              url: app.store.apiHost + '/ncommentauction/add',
              method: 'GET',
              data: {
                nauction_id: obj.data.id,
                nfans_id: app.store.userInfo.id,
                nfans_nickname: app.store.userInfo.nickName,
                nfans_avatar: app.store.userInfo.avatarUrl,
                content: obj.data.content,
                pid: obj.data.pid,
                pfans_nickname: obj.data.pfans_nickname,
                rid: obj.data.rid
              },
              success: function (res) {
                wx.showToast({
                  title: '评论成功！',
                  duration: 1000
                });
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  icon: 'none',
                  duration: 2000
                });
              },
            });
          } else if (obj.data.infoType === 2) {   // 藏品
            wx.request({
              url: app.store.apiHost + '/ncommentproduct/add',
              method: 'GET',
              data: {
                nproduct_id: obj.data.id,
                nfans_id: app.store.userInfo.id,
                nfans_nickname: app.store.userInfo.nickName,
                nfans_avatar: app.store.userInfo.avatarUrl,
                content: obj.data.content,
                pid: obj.data.pid,
                pfans_nickname: obj.data.pfans_nickname,
                rid: obj.data.rid
              },
              success: function (res) {
                wx.showToast({
                  title: '评论成功！',
                  duration: 1000,
                });
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！',
                  icon: 'none',
                  duration: 2000
                });
              },
            });
        } else if (obj.data.infoType === 3) {  // 拍品
          wx.request({
            url: app.store.apiHost + '/ncommentitem/add',
            method: 'GET',
            data: {
              nauction_item_id: obj.data.id,
              nfans_id: app.store.userInfo.id,
              nfans_nickname: app.store.userInfo.nickName,
              nfans_avatar: app.store.userInfo.avatarUrl,
              content: obj.data.content,
              pid: obj.data.pid,
              pfans_nickname: obj.data.pfans_nickname,
              rid: obj.data.rid
            },
            success: function (res) {
              wx.showToast({
                title: '评论成功！',
                duration: 1000
              });
            },
            fail: function (e) {
              wx.showToast({
                title: '网络异常！',
                icon: 'none',
                duration: 2000
              });
            },
          });
        }
        obj.resetForm();
        obj.setData({
          list: [],
          page: 1,
          isCommit: false,
        })
        setTimeout(() => {
          obj.loadData();
        }, 100);
      }
    } else {
      app.reinitAuthorize();
    }
  },
  showCommit: function() {
    this.resetForm();
    this.setData({
      isCommit: true,
    })
  },
  resetForm() {
    this.setData({
      content: '',        // 评论的内容
      pid: 0,            // 评论的上级id
      pfans_nickname: '', // 评论的上级名称 
      rid: 0,            // 评论的根id
      replyMsg: '请填写评论..',
      commitEnable: false,
    })
  },
  cancelComment: function() {
    this.resetForm();
    this.setData({
      isCommit: false,
    })
  },
  //  回复
  replay: function(e) {
    var obj = this;
    obj.setData({
      isCommit: true,
      pid: e.target.dataset.pid,
      pfans_nickname: e.target.dataset.name,
      rid: e.target.dataset.rid,
      replyMsg: `回复：${e.target.dataset.name}`,
    })
    // console.log(e);
  },
  //点击加载更多
  getMore: function (e) {
    var obj = this;

    obj.setData({
      page: obj.data.page + 1,
    });

    obj.loadData();
  },
})