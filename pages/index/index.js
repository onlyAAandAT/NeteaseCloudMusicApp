// index.js
// 获取应用实例
import request from '../../utils/request'
const app = getApp()

Page({
  data: {
    // 轮播图数据
    bannerList: [],
    // 推荐歌曲
    recommendList: [],
    // 排行榜
    topList: []
  },
  // 事件处理函数
  bindViewTap() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: async function () {
    let bannerListData = await request('/banner', {
      type: 1
    })
    this.setData({
      bannerList: bannerListData.banners
    })
    let recommendListData = await request('/personalized', {
      limit: 10
    })
    this.setData({
      recommendList: recommendListData.result
    })
    // 排行榜的请求发送次数应该为5次，idx修改进行参数传递
    // let index = 0
    // let resultArr = []
    // while (index < 5) {
    //   let topListData = await request('/top/list', {
    //     idx: index
    //   })
    //   index=index+1
    //   // 数据截取，splice：会对原数组进行修改；slice：不会对原数组进行修改
    //   let topListItem={name:topListData.playlist.name,tracks:topListData.playlist.tracks.slice(0,3)}
    //   resultArr.push(topListItem)
    //   // 这里每次请求后就渲染，减少白屏时间
    //   this.setData({
    //     topList:resultArr
    //   })
    // }
    let topList = await request('/toplist')
    let resultArr = []
    for (let i = 0; i < 5; i++) {
      let topListId = topList.list[i].id
      let topListItem = await request('/playlist/detail', {
        id: topListId
      })
      let weneed = {
        name: topListItem.playlist.name,
        tracks: topListItem.playlist.tracks.slice(0, 3)
      }
      resultArr.push(weneed)
      this.setData({
        topList: resultArr
      })
    }
  },
  toRecommendSong() {
    wx.navigateTo({
      url: '/songPackage/pages/recommendSong/recommendSong',
    })
  },
  toOther(){
    wx.navigateTo({
      url: '/otherPackage/pages/other/other',
    })
  }
})