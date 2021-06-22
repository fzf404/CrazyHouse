export default {
  pages: [
    'pages/index/index',    // 首页
    'pages/home/index',     // 个人中心
    'pages/help/index',     // 帮助
    'pages/calendar/index', // 日程表
    'pages/reserve/index',  // 用户预定
    'pages/reserve/super',  // 管理员预定
    'pages/order/index',    // 个人预约列表
    'pages/manage/index',   // 订单管理
    'pages/history/index',  // 订单查询 
    'pages/analysis/index', // 收入分析

  ],
  window: {
    navigationStyle: 'custom',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#454545",
    selectedColor: "#E0620D",
    list: [
      {
        pagePath: "pages/index/index",
        text: "首页 ",
        // 未点击时显示的图片
        iconPath: "assets/index.png",
        // 点击后显示的图片
        selectedIconPath: "assets/index-select.png"
      },
      {
        pagePath: "pages/home/index",
        text: "个人中心",
        iconPath: "assets/my.png",
        selectedIconPath: "assets/my-select.png"
      }
    ]
  },
  cloud: true
}
