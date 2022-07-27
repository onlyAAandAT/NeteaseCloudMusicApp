// pages/login/login.js
import request from '../../utils/request'
/* 
  登录流程：
    1.收集表单项数据
    2.前端验证：验证用户信息合法，前端验证通过，携带请求发送给服务器
    3.后端验证：验证用户是否存在
*/
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  handleInput(event) {
    // 表单项内容发生改变且不失焦调用
    let type = event.currentTarget.id
    this.setData({
      // 对象内变量用[]包裹
      [type]: event.detail.value
    })
  },
  // 登录回调
  async login() {
    let {
      phone,
      password
    } = this.data
    // 前端验证
    /* 
      手机号验证：
        1、空？
        2、格式？
      密码验证：
        1、空？
    */
    if (!phone) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return
    }
    //  正则:1开头，第二位3-9，后续9位数字
    let phoneReg = /^1[3-9]\d{9}$/
    if (!phoneReg.test(phone)) {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return
    }
    if (!password) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return
    }
    // 前端验证通过
    // 后端验证，请求且返回
    let result = await request('/login/cellphone', {
      phone,
      password,
      isLogin: true
    })
    console.log(result)
    if (result.code === 200) {
      wx.showToast({
        title: '登录成功',
      })
      
      // 将用户信息存储到本地
      wx.setStorageSync('userInfo', JSON.stringify(result))
      // 跳转到有tabbar的页面
      wx.switchTab({
        url: '/pages/personal/personal',
      })
    } else if (result.code === 502) {
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})