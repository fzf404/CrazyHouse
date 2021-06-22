import { Component } from 'react'
import Taro from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'

import { AtList, AtListItem, AtForm, AtInput, AtButton, AtMessage, AtToast, AtTextarea } from 'taro-ui'

import QRcode from '../../components/contact'


import './index.scss'

export default class Index extends Component {
  state = {
    selector: ['门店1', '门店2'],
    selectorChecked: '请选择',

    storeIndex: null,
    selectDate: null,
    name: '无名氏',
    phone: '无名氏',
    wxid: '无名氏',
    remark: '',
    price: null,

    waiting: false,
    showQRCode: false,
  }



  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() {
    this.setState({
      selectDate: Taro.getCurrentPages()[0].data.selectDate
    })
  }

  componentDidHide() { }

  onSelectChange = e => {
    this.setState({
      selectorChecked: this.state.selector[e.detail.value],
      storeIndex: e.detail.value

    })
  }

  handleReserve = async () => {
    const { name, phone, wxid, remark, selectDate, storeIndex, price } = this.state

    if (!price || !selectDate || storeIndex == null) {
      return Taro.atMessage({
        'message': '请填写必要信息哦~',
        'type': 'warning',
      })
    }

    const formatDate = parseInt(selectDate.replace(/-/g, ''))
    const scheduleDB = Taro.cloud.database().collection('schedules')

    this.setState({ waiting: true })

    // 判断是否未支付
    const hasNoPayData = await scheduleDB.where({
      pay: false
    }).get({})
    const hasNoPay = hasNoPayData.data.length != 0 ? true : false
    if (hasNoPay) {
      this.setState({ waiting: false })
      return Taro.atMessage({
        'message': '您有待支付的订单，请删除或联系管理员支付',
        'type': 'warning',
      })
    }

    Taro.cloud
      .callFunction({
        name: "reserve",
        data: {
          name, phone, wxid, remark, storeIndex, price,
          remark,
          date: formatDate,
        }
      }).then((res) => {

        this.setState({ waiting: false })

        if (res.result.code != 200) {
          return Taro.atMessage({
            'message': res.result.msg,
            'type': 'error',
          })
        }

        Taro.atMessage({
          'message': res.result.msg,
          'type': 'success',
        })

        this.setState({
          payInfo: `\n门店：门店${parseInt(this.state.storeIndex) + 1}\n日期：${this.state.selectDate}\n价格：${res.result.data.price}`,
          showQRCode: true
        })
      })
  }

  handleNameChange(name) {
    this.setState({ name })
  }
  handlePhoneChange(phone) {
    this.setState({ phone })
  }
  handleWxidChange(wxid) {
    this.setState({ wxid })
  }
  handlePriceChange(price) {
    this.setState({ price })
  }
  handleRemarkChange(remark) {
    this.setState({ remark })
  }

  handleQRClose() {
    this.setState({ showQRCode: false })
  }

  render() {
    return (
      <View className='container'>

        {/* 消息通知 */}
        <AtMessage />

        {/* 展示店长微信 */}
        <QRcode showQRCode={this.state.showQRCode} close={this.handleQRClose.bind(this)} info={'截屏后扫一扫添加店长进行付款\n' + this.state.payInfo} />

        {/* 加载中 */}
        <AtToast isOpened={this.state.waiting} text='处理中，请稍后' icon='loading-2'></AtToast>

        <AtForm>
          <Picker mode='selector' range={this.state.selector} onChange={this.onSelectChange}>
            <AtList>
              <AtListItem
                required
                title='※ 选择门店 ※'

                extraText={this.state.selectorChecked}
              />
            </AtList>
          </Picker>

          <AtInput
            name='name'
            title='姓名'
            type='text'
            value={this.state.name}
            placeholder='联系人姓名'
            onChange={this.handleNameChange.bind(this)}
          />

          <AtInput
            name='phone'
            title='联系电话'
            type='text'
            value={this.state.phone}
            placeholder='联系人电话'
            onChange={this.handlePhoneChange.bind(this)}
          />

          <AtInput
            name='wxid'
            title='微信号'
            type='text'
            value={this.state.wxid}
            placeholder='联系人微信号'
            onChange={this.handleWxidChange.bind(this)}
          />

          <AtInput
            required
            name='price'
            title='支付金额'
            type='number'
            value={this.state.price}
            placeholder='支付金额'
            onChange={this.handlePriceChange.bind(this)}
          />

          <View
            className='remark'
          >

            <AtTextarea
              value={this.state.remark}
              placeholder='备注信息，如预计到达时间...'
              maxLength='80'
              onChange={this.handleRemarkChange.bind(this)}
            />
          </View>

          <View style='padding:  20rpx 50rpx;'>

            <AtButton
              type='secondary'
              onClick={() => {
                const storeIndex = this.state.storeIndex
                if (storeIndex == null) {
                  return Taro.atMessage({
                    'message': '请先选择门店',
                    'type': 'warning',
                  })
                }
                Taro.navigateTo({
                  url: `/pages/calendar/index?storeIndex=${storeIndex}`
                })
              }
              }
            >
              {this.state.selectDate ? this.state.selectDate : '选择日期'}
            </AtButton>

            <AtButton
              type='primary'
              className='reserve-button'
              onClick={this.handleReserve}
              maxLength='100'
            >提 交 订 单</AtButton>


          </View>

        </AtForm>
      </View >
    )
  }
}
