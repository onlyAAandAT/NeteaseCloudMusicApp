// pages/recommendSong/recommendSong.js
import request from '../../../utils/request'
import pubsub from 'pubsub-js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [],
    index: 0,// 点击音乐的下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 用户是否登录
    let userInfo = wx.getStorageSync('userInfo')
    if(!userInfo){
      wx.showToast({
        title: '请先登录',
        icon:'none',
        success:()=>{
          // 跳转登录界面
          wx.reLaunch({
            url: '/pages/login/login'
          })
        }
      })
    }
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth() + 1
    })
    this.requestRecommendList()
    // 订阅来自songDeetail页面的消息
    pubsub.subscribe('switchType', (msg, type) => {
      // pubsub回调中，msg是消息名，data是数据，可以占位符去掉
      let {
        recommendList,
        index
      } = this.data
      if (type === "pre") {
        // 上一首
        // 上一首的队尾循环
        (index === 0) && (index = recommendList.length)
        index -= 1
      } else {
        // 下一首
        // 下一首的队头循环
        (index === recommendList.length-1) && (index = -1)
        index += 1
      }
      let musicId = recommendList[index].id
      this.setData({
        index
      })
      // musicId传回去给songDetail
      pubsub.publish('musicId',musicId)
    })
  },
  async requestRecommendList() {
    let recommendListData = await request('/recommend/songs')
    this.setData({
      recommendList: recommendListData.data.dailySongs
    })
  },
  // 传参路由跳转
  toSongDetail(event) {
    let {
      song,
      index
    } = event.currentTarget.dataset
    this.setData({
      index
    })
    // query参数传参，参数太长就不好传
    // navigateTo跳转，可以回退
    wx.navigateTo({
      // 不能直接传那么长的song对象，会被自动截取，因此只取id后再发请求
      url: '/pages/songDetail/songDetail?musicId=' + song.id,
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