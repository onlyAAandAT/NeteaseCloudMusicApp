// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],
    navId: '',
    videoList: [],
    videoId: '', // 视频的id标识，用于图片切换
    videoUrl: '',
    videoUpdateTime: [], // 记录video播放的时间
    isTriggered: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取导航标签数据
    this.getVideoGroupLiistData()

  },
  async getVideoGroupLiistData() {
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0, 14),
      navId: videoGroupListData.data[0].id
    })
    this.getVideoList(this.data.navId)
  },
  // 跳转搜索
  toSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
    })
  },
  // 点击切换导航
  changeNav(event) {
    let navId = event.currentTarget.dataset.id
    this.setData({
      navId: navId >>> 0
    })
    // console.log(event)
    // 动态获取当前导航对应的视频数据
    wx.showLoading({
      title: '正在加载',
    })
    this.setData({
      videoList: []
    })
    this.getVideoList(this.data.navId)

  },
  // 获取视频列表数据
  async getVideoList(navId) {
    if (navId) {
      let videoListData = await request('/video/group', {
        id: navId
      })
      // 关闭消息提示框
      wx.hideLoading()
      let index = 0
      let videoList = videoListData.datas.map(item => {
        item.id = index++;
        return item
      })
      this.setData({
        videoList,
        isTriggered: false // 关闭下拉刷新
      })
    }
  },
  // 点击播放的回调
  async handlePlay(event) {
    /* 
    解决多个视频同时播放的问题
      点击播放事件上需要找到上一个播放的视频
      在播放视频之前关闭上一个正在播放的视频
      关键：
        如何找到上一个视频的实例对象
        如何确认点击播放的视频是不是同一个视频
     */
    console.log(event)
    let vid = event.currentTarget.id
    // 如果上一个视频被点开过的话（存在videoContext），则关闭上一个视频
    this.vid !== vid && this.videoContext && this.videoContext.stop()
    // this.vid !== vid && this.videoContext && this.setData({videoUrl: ''})
    this.vid = vid; // 更新vid，用于下一次点击的vid判定
    // 更新data中videoId的状态数据
    this.setData({
      videoId: vid
    })
    if (event.type === "tap") {
      let videoResult = await request('/video/url', {
        id: vid
      })
      this.setData({
        videoUrl: videoResult.urls[0].url
      })
    }
    // 创建新的控制video标签的实例对象,并且覆盖到全局wx，this上，只通过一个实例对象控制所有video实例
    // 单例模式：在创建多个对象的场景下，通过一个变量接收，始终保持只有一个对象，节省内存空间
    this.videoContext = wx.createVideoContext(vid)
    let {
      videoUpdateTime
    } = this.data
    let videoItem = videoUpdateTime.find(item => item.vid === vid)
    if (videoItem) {
      // 上次播放进度
      this.videoContext.seek(videoItem.currentTime)
    }
    // this.videoContext.play()
  },
  // 监听视频播放进度
  handleTimeUpdate(event) {
    // 在video标签处传入的id也可以在此处有用
    let videoTimeObj = {
      vid: event.currentTarget.id,
      currentTime: event.detail.currentTime
    }
    /* 
      思路：判断记录播放时长的videoUpdateTime数组中是否存在当前视频的播放记录
        1.如果有，在原有的播放记录中修改播放事件为当前的播放时间
        2.如果没有，需要在数组中添加当前视频播放对象
    */
    // 不能直接push，因为会重复push id一样的数据
    let {
      videoUpdateTime
    } = this.data;
    // 找找对象中有没有符合条件的
    let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid)
    if (videoItem) {
      // 之前有
      videoItem.currentTime = event.detail.currentTime
    } else {
      // 新开的视频
      videoUpdateTime.push(videoTimeObj)
    }
    this.setData({
      videoUpdateTime
    })
  },
  // 视频播放结束调用
  handleEnded(event) {
    // 视频播放结束后，在数组中删除对应的对象
    let {
      videoUpdateTime
    } = this.data
    // findIndex返回元素下标，splice在下标前往后删一位
    videoUpdateTime.splice(videoUpdateTime.findIndex(item => item.vid === event.currentTarget.dataset.id), 1)
    this.setData({
      videoUpdateTime
    })
  },
  // 下拉触发回调
  handleRefresher() {
    // 发请求获取新的视频列表
    this.getVideoList(this.data.navId)
  },
  // 上拉触底回调
  handleToLower() {
    console.log(123)
    // 数据分页：1.后端分页；2.前端分页
    // 模拟后端分页
    // 这里就不做了，用的模拟数据，直接push到原数组后，网易云的接口中有offset可以调用
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
  onShareAppMessage({
    from
  }) {
    // 只有定义了这个函数，才能够在页面上显示分享按钮
    if (from === 'button') {
      return {
        title: 'button转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/default.jpg'
      }
    } else {
      return {
        title: 'menu转发',
        page: '/pages/video/video',
        imageUrl: '/static/images/default.jpg'
      }
    }

  }
})