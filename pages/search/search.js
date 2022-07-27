// pages/search/search.js
import request from '../../utils/request'
let isSend = false
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeHolderContent: "", // placeholder的默认内容
    hotList: [], // 热搜榜数组
    searchContent: "", // 用户输入的表单项数据
    songsList: [], // 搜索返回的数组
    searchHistory: [], // 搜索历史记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // 获取初始化数据
    this.getInitData()
    // 获取本地历史记录
    this.getSearchHistory()
  },
  getSearchHistory() {
    let searchHistory = wx.getStorageSync('searchHistory')
    if (searchHistory) {
      this.setData({
        searchHistory
      })
    }
  },
  // 获取初始化数据
  async getInitData() {
    let placeHolderData = await request('/search/default')
    let hotListData = await request('/search/hot/detail')
    this.setData({
      placeHolderContent: placeHolderData.data.showKeyword,
      hotList: hotListData.data
    })
  },
  // 表单项内容发生改变的回调
  handleInputChange(event) {
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // 函数节流
    if (isSend) return
    isSend = true
    this.getSearchList()
    setTimeout(async () => {
      isSend = false
    }, 300)
  },
  // 获取数据
  async getSearchList() {
    if (!this.data.searchContent) {
      this.setData({
        songsList: []
      })
      return
    }
    let {
      searchContent,
      searchHistory
    } = this.data
    let songsListDetail = await request('/search', {
      keywords: this.data.searchContent,
      limit: 10
    })
    this.setData({
      songsList: songsListDetail.result.songs
    })
    if (searchHistory.indexOf(searchContent) !== -1) {
      searchHistory.splice(searchHistory.indexOf(searchContent), 1)
    }
    searchHistory.unshift(searchContent)
    this.setData({
      searchHistory
    })
    wx.setStorageSync('searchHistory', searchHistory)
  },
  handleClearSearchContent() {
    console.log("clear")
    this.setData({
      searchContent: "",
      songsList: [],
    })
  },
  deleteSearchHistory() {
    wx.showModal({
      cancelColor: 'cancelColor',
      content: '确认清空历史记录吗？',
      success: (res) => {
        if (res.confirm) {
          this.setData({
            searchHistory: []
          })
          wx.removeStorageSync('searchHistory')
        }
      }
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