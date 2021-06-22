const cloud = require('wx-server-sdk')
// 初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const scheduleDB = db.collection('schedules')
const _ = db.command

exports.main = async (event, context) => {


  const orderId = event.orderId

  const data = await scheduleDB.doc(orderId).remove({})
  return {
    code: data.stats.removed ? 200 : 403,
    data,
    msg: data.stats.removed ? '删除成功' : '删除失败，请联系技术人员'
  }
}