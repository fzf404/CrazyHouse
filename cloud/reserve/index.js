const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
const axios = require("axios");
// 初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const userDB = db.collection('users')
const scheduleDB = db.collection('schedules')
const _ = db.command

exports.main = async (event, context) => {

  const reserveData = event

  // 判断该日期是否有人预定
  const getReserveInfo = await scheduleDB.where({
    storeIndex: reserveData.storeIndex,
    date: reserveData.date
  }).get({})
  if (getReserveInfo.data.length != 0) {
    return {
      code: 403,
      data: getReserveInfo,
      msg: '有人正在预定,请联系管理员或重试。'
    }
  }

  // 判断是否为会员
  const { OPENID } = cloud.getWXContext()
  const userInfo = await userDB.where({
    _openid: OPENID
  }).get({})



  let price = 0
  if (userInfo.data[0].isSuper && reserveData.price) {
    price = parseInt(reserveData.price)
  } else {
    // 价格计算
    await axios.get(`http://timor.tech/api/holiday/info/${dayjs((reserveData.date).toString()).add(1, 'day').format('YYYY-MM-DD')}`)
      .then((res) => {
        if (res.data.type.type == 1 || res.data.type.type == 2) {
          price = 1580
        } else {
          price = 1280
        }
      })
    if (userInfo.data[0].point > 0) {
      price *= 0.9
    }
  }

  // 存储
  const data = await scheduleDB.add({
    data: {
      _openid: OPENID,
      ...reserveData,
      price,
      pay: userInfo.data[0].isSuper ? true : false,
      submitTime: Date.now(),
    }
  })

  return {
    code: 200,
    data: {
      price,
      ...data
    },
    msg: '预定成功'
  }
}


