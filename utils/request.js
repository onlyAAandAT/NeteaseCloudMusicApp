// 发送ajax请求
/* 
  封装功能函数
    1.功能点明确
    2.固定代码
    3.动态穿形参
    4.设置形参的默认值
  封装功能组件
    1.功能点明确
    2.组件内部保留静态代码
    3.动态数据抽取成props参数，由使用者根据自身的情况以标签属性的形式动态传入props数据
    4.设置组件的必要性以及数据类型
*/
import config from './config'
export default (url, data = {}, method = "GET") => {
  return new Promise((resolve,reject) => {
    wx.request({
      url: config.host + url,
      data,
      method,
      header:{
        // cookie的有效值是MUSIC开头的一个数组元素，考虑本地存储中cookies存储空值的情况
        cookies:wx.getStorageSync('cookies')?wx.getStorageSync('cookies'):''
      },
      success: (res) => {
        // console.log(res)
        if(data.isLogin){// 登录请求
          // 用户cookie存入本地，有点奇怪但能用
          wx.setStorage({
            key:'cookies',
            data:res.data.cookie
          })
        }
        resolve(res.data)
      },
      fail: (err) => {
        // console.log(err)
        reject(err)
      }
    })
    }).catch((e)=>{
      console.log(e)
  })
}