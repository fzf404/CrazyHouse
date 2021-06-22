const cloud = require('wx-server-sdk')
const dayjs = require('dayjs')
// 初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})


const db = cloud.database()
const scheduleDB = db.collection('schedules')
const _ = db.command

exports.main = async (event, context) => {


  const { startDate, endDate } = event

  const data = await scheduleDB.where({
    date: _.gte(startDate).and( _.lte(endDate)),
  }).get({})

  return data
}


