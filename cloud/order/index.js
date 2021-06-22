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


  const storeIndex = event.storeIndex

  await scheduleDB.where({
    submitTime: _.lte(Date.now() - (3600 * 1000 * 24)),
    pay: false,
  }).remove({})

  const data = await scheduleDB.where({
    date: _.gte(parseInt(dayjs().format('YYYYMMDD'))),
    storeIndex: storeIndex,
  }).get({})

  return data
}


