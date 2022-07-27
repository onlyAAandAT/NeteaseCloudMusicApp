// pages/personal/personal.js
import request from '../../utils/request'
let startY = 0;
let moveY = 0;
let moveDistance = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform:'translateY(0)',
    coverTransition:'',
    userInfo:{},
    recetPlayList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 读取本地存储上的用户信息
    let userInfo = wx.getStorageSync('userInfo')
    if(userInfo){
      this.setData({
        userInfo:JSON.parse(userInfo)
      })
      // 获取用户播放记录
      this.getUserRecentPlayList(this.data.userInfo.profile.userId)
    }
  },
  handleTouchStart(event) {
    startY = event.touches[0].clientY // 第一个手指的下落坐标
    this.setData({
      coverTransition:''
    })
  },
  handleTouchMove(event) {
    // 手指移动的纵向坐标-起始坐标=移动距离 赋值给纵向偏移量
    moveY = event.touches[0].clientY // 第一个手指的Y轴移动距离
    moveDistance = moveY - startY
    if(moveDistance<=0) return
    if(moveDistance>=80){
      moveDistance=80
    }
    this.setData({
      coverTransform:`translateY(${moveDistance}rpx)`
    })
  },
  handleTouchEnd() {
    this.setData({
      coverTransform:'translateY(0)',
      coverTransition:'transform 0.1s linear'
    })
  },
  // 跳转至登录
  toLogin(){
    wx.reLaunch({
      url: '/pages/login/login',
    })
  },
  // 获取用户的播放历史记录
  async getUserRecentPlayList(userId){
    let recentPlayListData = await request('/user/record',{uid:userId,type:0})
    let index = 0
    // 添加index
    let recentPlayList = recentPlayListData.allData.splice(0,10).map(item=>{
      item.id = index++;
      return item;
    })
    this.setData({
      recentPlayList
    })
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