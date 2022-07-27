// pages/songDetail/songDetail.js
import pubsub from 'pubsub-js'
import request from '../../../utils/request'
import moment from 'moment'
// 获取全局实例
const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false, // 视频是否在播放
    song: {},
    musicId: '',
    musicLink:'',
    currentTime:'00:00',// 实时时间
    durationTime:'00:00',// 总时长
    currentWidth:0 // 实时进度条宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // options注入的是query传参
    // 原生小程序中路由传参，对路由传参有长度限制，如果参数过长，会自动截取
    let musicId = options.musicId
    this.setData({
      musicId
    })
    this.requestSongDetail(musicId)
    // 判断当前页面音乐是否在播放
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId===musicId){
      // 有音乐在播放，且是上次小退后的同一首
      this.setData({
        isPlay:true
      })
    }
    // 部署背景音乐的监听(播放、暂停、停止)
    /* 
      如果用户直接操作系统的音乐播放器去控制音乐的播放与暂停，会导致页面的状态与音乐的状态不一致
      可以通过控制音频实例监听音乐的播放与暂停
    */
    this.backgroundAudioManager = wx.getBackgroundAudioManager()
    this.backgroundAudioManager.onPlay(() => {
      this.changePlayState(true)
      appInstance.globalData.musicId = musicId
    })
    this.backgroundAudioManager.onPause(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onStop(() => {
      this.changePlayState(false)
    })
    this.backgroundAudioManager.onEnded(() => {
      // 切换至下一首音乐并且自动播放
      // 实时进度条清空
      pubsub.publish('switchType','next')
      this.setData({
        currentWidth:0,
        currentTime:'00:00'
      })
    })
    this.backgroundAudioManager.onTimeUpdate(()=>{
      // 前台播放时间监听
      // currentTime和duration
      // 格式化
      let currentTime = moment(this.backgroundAudioManager.currentTime*1000).format("mm:ss")
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration * 450
      this.setData({
        currentTime,
        currentWidth
      })
    })
    // // 订阅来自recommendSong发布的musicId消息
    // pubsub.subscribe('musicId',(msg,musicId)=>{
    //   this.requestSongDetail(musicId)
    //   // 这里不要传第三个参数，因为跳下一首或者上一首歌，就不能让musicLink里面有东西
    //   this.musicControl(true,musicId)
    // })
  },
  // 修改播放状态的功能函数
  changePlayState(isPlay){
    this.setData({
      isPlay
    })
    // 全局音乐播放状态，解决小退后重新播放时页面播放状态显示不正确的问题
    appInstance.globalData.isMusicPlay = isPlay
  },
  // 根据id发送歌曲的详细信息以及播放请求
  async requestSongDetail(musicId) {
    let songData = await request('/songPackage/detail', {
      ids: musicId
    })
    let durationTime = moment(songData.songs[0].dt).format('mm:ss')
    this.setData({
      song: songData.songs[0],
      durationTime
    })
    // 动态修改窗口标题
    wx.setNavigationBarTitle({
      title: this.data.song.name,
    })
  },
  handleMusicPlay() {
    let isPlay = !this.data.isPlay
    this.setData({
      isPlay
    })
    this.musicControl(this.data.isPlay, this.data.musicId,this.musicLink)
  },
  // 控制音乐播放暂停的功能函数
  async musicControl(isPlay, musicId,musicLink) {
    if (isPlay) {
      // 音乐播放
      // 给一个音乐播放链接，要发请求
      // 获取音乐的播放链接
      if(!musicLink){
        let musicLinkData = await request('/song/url', {
          id: musicId
        })
        musicLink = musicLinkData.data[0].url
        this.setData({
          musicLink
        })
      }
      this.backgroundAudioManager.src = musicLink
      // 不给title会出不了声音
      this.backgroundAudioManager.title = this.data.song.name
    } else {
      // 音乐暂停
      this.backgroundAudioManager.pause()
    }
  },
  // 上一首、下一首音频切换
  handleSwitch(event){
    // 获取切换类型
    let type = event.currentTarget.id
    pubsub.subscribe('musicId',(msg,musicId)=>{
      this.requestSongDetail(musicId)
      this.musicControl(true,musicId)
      pubsub.unsubscribe('musicId')
    })
    // 关闭当前播放音乐
    this.backgroundAudioManager.stop()
    // 向recommendSong通信获取上一首或者下一首的id
    // pubsub-js
    // 发布消息
    pubsub.publish('switchType',type)
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