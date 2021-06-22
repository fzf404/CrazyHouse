const cloud = require('wx-server-sdk')
// 初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const scheduleDB = db.collection('schedules')
const userDB = db.collection('users')
const _ = db.command

exports.main = async (event, context) => {


  const orderId = event.orderId

  const orderUpdate = await scheduleDB.doc(orderId).update({
    data: {
      pay: true
    },
  })

  console.log(orderUpdate)


  const res = await scheduleDB.doc(orderId).get({})

  console.log(res)

  const OPENID = res.data._openid

  const userUpdate = await userDB.where({
    _openid: OPENID
  }).update({
    data: {
      point: _.inc(1)
    }
  })


  console.log(userUpdate)



  return {
    code: orderUpdate.stats.updated ? 200 : 403,
    data: {
      orderUpdate, userUpdate
    },
    msg: orderUpdate.stats.updated ? '设置成功' : '设定失败，请联系技术人员'
  }
}