// app.js
App({
  store: {
    apiHost: 'https://art.me-genius.top',
    userInfo: {},
  },
  onLaunch: function () {
    var obj = this;

    // 调起授权说明窗口
    wx.authorize({
      scope: 'scope.userInfo',
      success() {
        //窗口成功调起后

        //拉取用户的信息
        wx.getUserInfo({
          withCredentials: false,
          success: function (res) {
            obj.store.userInfo = res.userInfo;
          }
        });

        //调用登录接口，并去服务端拉取openid和session_key的信息，并在服务端完成保存新用户的操作
        wx.login({
          success: function (res) {
            var code = res.code;

            wx.request({
              url: obj.store.apiHost + '/nfans/add',
              method: 'post',
              data: {
                code: code,
                info: JSON.stringify(obj.store.userInfo),
              },
              header: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                var response = res.data.data;

                obj.store.userInfo.openid = response.openid;
                obj.store.userInfo.id = response.id;
                obj.store.userInfo.mobile = response.mobile;
              },
              fail: function (e) {
                wx.showToast({
                  title: '网络异常！err:opeinid',
                  duration: 2000
                });
              },
            });
          }
        });
      },
      fail() {
        //授权失败时
        obj.store.userInfo = {
          nickName: '',
          gender: 0,
          language: 'zh_CN',
          city: '',
          province: '',
          country: '',
          avatarUrl: '',
          openid: '',
          id: -1,
          mobile: '',
        };
        wx.showToast({
          title: '请授权',
          duration: 2000
        });
      }
    });
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
  },



  bindMobile:function(){
    var user = this.store.userInfo;

    if(!user.mobile){
      wx.navigateTo({
        url: 'pages/binding/binding'
      });
    }
  },
  isAuthority() {
    if (this.store.userInfo.id !== -1) {
      return true;
    } else {
      return false;
    }
  },
  reinitAuthorize() {
    wx.showToast({
      title: '请先完成授权！',
      duration: 1000
    });
    var obj = this;
    setTimeout(function () {
      wx.openSetting({
        success: (res) => {
          /*
           * res.authSetting = {
           *   "scope.userInfo": true,
           *   "scope.userLocation": true
           * }
           */
          if (res.authSetting['scope.userInfo'] == true) {
            //拉取用户的信息
            wx.getUserInfo({
              withCredentials: false,
              success: function (res) {
                obj.store.userInfo = res.userInfo;

                //调用登录接口，并去服务端拉取openid和session_key的信息，并在服务端完成保存新用户的操作
                wx.login({
                  success: function (res) {
                    var code = res.code;

                    wx.request({
                      url: obj.store.apiHost + '/nfans/add',
                      method: 'post',
                      data: {
                        code: code,
                        info: JSON.stringify(obj.store.userInfo),
                      },
                      header: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                      success: function (res) {
                        var response = res.data.data;

                        obj.store.userInfo.openid = response.openid;
                        obj.store.userInfo.id = response.id;
                        obj.store.userInfo.mobile = response.mobile;


                      },
                      fail: function (e) {
                        wx.showToast({
                          title: '网络异常！err:opeinid',
                          duration: 2000
                        });
                      },
                    });
                  }
                });
              },
              fail: function (res) {
                // 没有授权，什么都不干
              }
            });
          }
        }
      });
    }, 1000);
  },
});
