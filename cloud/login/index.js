const cloud = require('wx-server-sdk')
// 初始化
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

exports.main = async (event, context) => {

  const { OPENID } = cloud.getWXContext()
  
  return {
    code: 200,
    msg: '获取成功',
    openId: OPENID,
  }

}


