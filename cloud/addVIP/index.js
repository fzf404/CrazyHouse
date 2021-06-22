const cloud = require('wx-server-sdk')
// 初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const userDB = db.collection('users')
const _ = db.command

exports.main = async (event, context) => {


  const openId = event.openId

  const data = await userDB.where({
    _openid: openId
  }).update({
    data: {
      point: 1
    }
  })

  return {
    code: data.stats.updated ? 200 : 403,
    data,
    msg: data.stats.updated ? '增加成功' : '该用户已经为会员或openid错误'
  }
}