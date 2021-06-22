import { Button, Image, Text, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Component } from 'react'
import { AtButton, AtCard, AtList, AtListItem, AtMessage, AtModal, AtModalAction, AtModalContent, AtModalHeader, AtRadio, AtToast } from 'taro-ui'
import QRcode from '../../components/contact'
import './index.scss'




export default class Index extends Component {

  state = {
    avatarUrl: null,
    nickName: null,
    point: 0,
    openId: '',

    isLogin: false,
    waiting: false,
    showStoreSelect: false,
    showQRCode: false,
    showVipCode: false,
    showAddVip: false,

    AddVipStatus: null,

    storeIndex: 0,  // 门店信息
    subMenuIndex: 0,

    isSuper: false
  }

  componentWillMount() {
    // 尝试获取用户信息
    Taro.getStorage({
      key: 'userInfo'
    }).then((res) => {
      this.setState({
        avatarUrl: res.data.avatarUrl,
        nickName: res.data.nickName
      })
    }).then(() => {
      Taro.getStorage({
        key: 'openId'
      }).then((res) => {
        this.setState({ openId: res.data })
        this.getDBUser(res.data)
      })
    })

  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    Taro.getStorage({
      key: 'openId'
    }).then((res) => {
      this.getDBUser(res.data)
    })
  }

  componentDidHide() { }

  // 获取用户信息
  getUserProfile = () => {
    Taro.getUserProfile({
      desc: '完善会员资料'
    })
      .then((res) => {
        this.setState({ waiting: true })
        // 保存会员资料
        Taro.setStorage({
          key: "userInfo",
          data: res.userInfo
        }).then(() => {
          // 更新用户资料
          this.setState({
            avatarUrl: res.userInfo.avatarUrl,
            nickName: res.userInfo.nickName,
          })
          this.getOpenId()
        })
      })
  }

  // 获得OpenID
  getOpenId = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then((res) => {
        Taro.setStorage({
          key: "openId",
          data: res.result.openId
        })
        this.getDBUser(res.result.openId)
      })
  }

  // 数据查询
  getDBUser = async (openId) => {
    this.setState({ waiting: true })
    const userDB = Taro.cloud.database().collection('users')
    userDB.get({
      success: (res) => {
        // 用户不存在则创建
        if (res.data.length == 0) {
          userDB.add({
            data: {
              point: 0,
              nickName: this.state.nickName,
              isSuper: false,
            },
            success: () => {
              this.getDBUser(openId)
            }
          })
          // 用户存在则获取积分
        } else {
          const { point, isSuper } = res.data[0]
          Taro.setStorage({
            key: "point",
            data: point,
          })
          this.setState({ point, isSuper, isLogin: true, waiting: false })
        }
      },
    })
  }

  handleStoreSelect(storeIndex) {
    this.setState({
      storeIndex,
    })
  }

  handleQRClose() {
    this.setState({ showQRCode: false, showVipCode: false })
  }


  render() {
    return (
      <View className='container'>

        {/* 消息通知 */}
        <AtMessage className='message' />


        {/* 展示店长微信 */}
        <QRcode
          showQRCode={this.state.showQRCode}
          close={this.handleQRClose.bind(this)}
          info='截屏后回到微信扫一扫添加店长'
        />

        {/* 展示会员群 */}
        <QRcode
          showQRCode={this.state.showVipCode}
          QRcodeImg='cloud://production-4gh3g3wq4acaed67.7072-production-4gh3g3wq4acaed67-1306247830/basic-img/manager-wx.jpg'
          close={this.handleQRClose.bind(this)}
          info='截屏后微信扫一扫添加会员群'
        />

        {/* 加载中 */}
        <AtToast
          isOpened={this.state.waiting}
          text='加载中...'
          icon='loading-2'
        />

        {/* 增加会员提示 */}
        <AtToast
          isOpened={this.state.showAddVip}
          text={this.state.AddVipStatus}
          icon='eye'
        />

        {/* 门店选择 */}
        <AtModal
          isOpened={this.state.showStoreSelect}
          onClose={() => this.setState({ showStoreSelect: false })}
        >
          <AtModalHeader>选择门店</AtModalHeader>
          <AtModalContent>
            <AtRadio
              options={[
                { label: '门店1', value: 0 },
                { label: '门店2', value: 1 },
              ]}
              value={this.state.storeIndex}
              onClick={this.handleStoreSelect.bind(this)}
            />
          </AtModalContent>
          <AtModalAction>
            <Button
              onClick={() => {
                this.setState({ showStoreSelect: false })
                switch (this.state.subMenuIndex) {
                  case 0:
                    Taro.navigateTo({
                      url: `/pages/calendar/index?storeIndex=${this.state.storeIndex}`
                    })
                    break
                  case 1:
                    Taro.navigateTo({
                      url: `/pages/manage/index?storeIndex=${this.state.storeIndex}`
                    })
                    break
                  case 2:
                    Taro.navigateTo({
                      url: `/pages/history/index?storeIndex=${this.state.storeIndex}`
                    })
                    break
                }
              }}
            >确定</Button>
          </AtModalAction>
        </AtModal>

        <View className='home-head'>

          <View className='at-row'>
            <View className='at-col-4'>
              <Image className='headimg' src={this.state.avatarUrl}></Image>
            </View>
            <View className='at-col-4'>
              {
                this.state.isLogin
                  ?
                  <View>
                    <View className='username'>{this.state.nickName}</View>
                    <AtButton
                      className='usergroup'
                      onClick={() => {
                        Taro.setClipboardData({ data: this.state.openId })
                      }}
                    >
                      {this.state.isSuper ? '管理员' : (this.state.point > 0 ? 'VIP会员' : '普通用户')}
                    </AtButton>
                  </View>
                  :
                  <AtButton className='usergroup userauth' onClick={this.getUserProfile}>点我登录</AtButton>
              }
            </View>
            <View className='at-col-4'>
              <AtCard
                title='积分'
                className='userpoint'
              >
                <Text>{this.state.point}</Text>
              </AtCard>
            </View>
          </View>

        </View>
        <View className='home-body'>
          <AtList>
            <AtListItem
              title='我的预约'
              note='已预定的场次'
              arrow='right'
              iconInfo={{ size: 25, color: '#78A4FA', value: 'calendar' }}
              onClick={
                () => Taro.navigateTo({
                  url: '/pages/order/index'
                })
              }
            />
            <AtListItem
              title='日程表'
              note='已被预定的日程'
              arrow='right'
              onClick={
                () => this.setState({ showStoreSelect: true, subMenuIndex: 0 })
              }
              iconInfo={{ size: 25, color: '#ff6348', value: 'lightning-bolt' }}
            />

            {this.state.isSuper ?
              <View>

                <AtListItem
                  title='添加订单'
                  note='添加已存在订单'
                  arrow='right'
                  onClick={() => Taro.navigateTo({
                    url: '/pages/reserve/super'
                  })}

                  iconInfo={{ size: 25, color: '#f39c12', value: 'upload', }}
                />

                <AtListItem
                  title='全部订单'
                  note='支付或删除订单'
                  arrow='right'
                  onClick={
                    () => this.setState({ showStoreSelect: true, subMenuIndex: 1 })
                  }
                  iconInfo={{ size: 25, color: '#2ecc71', value: 'edit', }}
                />

                <AtListItem
                  title='订单查询'
                  note='查询时间段内订单'
                  arrow='right'
                  onClick={
                    () => {
                      Taro.navigateTo({
                        url: '/pages/history/index'
                      })
                    }
                  }
                  iconInfo={{ size: 25, color: '#5352ed', value: 'reload', }}
                />

                <AtListItem
                  title='收入分析'
                  note='每个月的收入分析'
                  arrow='right'
                  onClick={
                    () => {
                      Taro.navigateTo({
                        url: '/pages/analysis/index'
                      })
                    }
                  }
                  iconInfo={{ size: 25, color: '#ff4757', value: 'sketch', }}
                />

                <AtListItem
                  title='会员添加'
                  note='添加已存在会员'
                  arrow='right'
                  onClick={
                    () => {
                      this.setState({ waiting: true })
                      const that = this
                      Taro.getClipboardData({
                        success: function (clipboard) {
                          if (clipboard.data.length != 28) {
                            that.setState({ showAddVip: true, AddVipStatus: 'openid长度应该为18位' })
                            setTimeout(() => that.setState({ showAddVip: false }), 1400)
                            return Taro.atMessage({
                              'message': that.state.AddVipStatus,
                              'type': 'warning',
                            })
                          }
                          Taro.cloud
                            .callFunction({
                              name: "addVIP",
                              data: {
                                openId: clipboard.data
                              }
                            }).then(res => {
                              that.setState({ showAddVip: true, AddVipStatus: res.result.msg })
                              setTimeout(() => that.setState({ showAddVip: false }), 1400)
                              Taro.atMessage({
                                'message': res.result.msg,
                                'type': res.result.code == 200 ? 'success' : 'error',
                              })
                            })
                        }
                      })
                      this.setState({ waiting: false })
                    }
                  }
                  iconInfo={{ size: 25, color: '#8e44ad', value: 'add', }}
                />
              </View>
              :
              <View>
                <AtListItem
                  title='会员群'
                  note='添加会员群'
                  arrow='right'
                  onClick={
                    () => this.setState({ showVipCode: true })
                  }
                  iconInfo={{ size: 25, color: '#ffa502', value: 'message', }}
                />
                <AtListItem
                  title='联系我们'
                  note='微信'
                  arrow='right'
                  onClick={
                    () => this.setState({ showQRCode: true })
                  }
                  iconInfo={{ size: 25, color: '#2ecc71', value: 'phone' }}
                />
                <AtListItem
                  title='帮助'
                  note='获得帮助'
                  arrow='right'
                  onClick={() => Taro.navigateTo({
                    url: '/pages/help/index'
                  })}
                  iconInfo={{ size: 25, color: '#5352ed', value: 'help', }}
                />
              </View>
            }
          </AtList>
        </View>
      </View >
    )
  }
}
