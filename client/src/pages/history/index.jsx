import { Component } from 'react'
import { View, Button, Picker } from '@tarojs/components'
import dayjs from 'dayjs'
import { AtToast, AtList, AtButton,AtMessage, AtListItem, AtModal, AtModalHeader, AtModalContent, AtModalAction } from 'taro-ui'


import Taro from '@tarojs/taro'

import './index.scss'

export default class Index extends Component {

  state = {

    orderList: [],
    modalItem: {},
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().add(7, 'day').format('YYYY-MM-DD'),

    showOrderItem: false,
    waiting: false,
  }



  componentWillMount() {
  }



  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loadOrderList = () => {
    this.setState({ waiting: true })
    Taro.cloud
      .callFunction({
        name: "history",
        data: {
          startDate: parseInt(this.state.startDate.replace(/-/g, '')),
          endDate: parseInt(this.state.endDate.replace(/-/g, ''))
        }
      }).then(res => {
        const orderList = res.result.data.reverse().map(item => {
          item.date = item.date.toString()
          return item
        })

        this.setState({
          orderList,
          waiting: false
        })
      })
  }
  onStartDateChange = e => {
    this.setState({
      startDate: e.detail.value
    })
  }

  onEndDateChange = e => {
    this.setState({
      endDate: e.detail.value
    })
  }

  render() {
    return (
      <View className='container'>

        {/* 消息通知 */}
        <AtMessage />
        
        {/* 加载中 */}
        <AtToast
          isOpened={this.state.waiting}
          text='加载中...'
          icon='loading-2'
        />


            <AtModal 
              isOpened={this.state.showOrderItem}
              onClose={()=>this.setState({showOrderItem:false})}
            >
              <AtModalHeader>预定信息</AtModalHeader>
              <AtModalContent>
                <View>
                  时间：{dayjs(this.state.modalItem.date).format('YYYY-MM-DD')}
                </View>
                <View>
                  门店：{parseInt(this.state.modalItem.storeIndex) + 1}号门店
                </View>
                <View>
                  预定人：{this.state.modalItem.name}
                </View>
                <View>
                  电话：{this.state.modalItem.phone}
                </View>
                <View>
                  微信号：{this.state.modalItem.wxid}
                </View>
                <View >
                  价格：{this.state.modalItem.price}元
                </View>
                <View>
                  下单时间：{dayjs(this.state.modalItem.submitTime).format('YYYY-MM-DD HH:mm:ss')}
                </View>
                <View>
                  备注：{this.state.modalItem.remark}
                </View>
              </AtModalContent>
              <AtModalAction>
                <Button
                  style='color:green'
                  onClick={() => {
                    this.setState({ waiting: true })
                    Taro.cloud
                      .callFunction({
                        name: "payOrder",
                        data: {
                          orderId: this.state.modalItem._id
                        }
                      }).then((res) => {
                        Taro.atMessage({
                          'message': res.result.msg,
                          'type': res.result.code == 200 ? 'success' : 'error',
                        })
                        this.loadOrderList()
                        return this.setState({ showOrderItem: false, waiting: false })
                      })
                  }}
                >
                  已支付
                </Button>

                <Button
                  style='color:red'
                  onClick={() => {
                    this.setState({ waiting: true })
                    Taro.cloud
                      .callFunction({
                        name: "delOrder",
                        data: {
                          orderId: this.state.modalItem._id
                        }
                      }).then(res => {
                        Taro.atMessage({
                          'message': res.result.msg,
                          'type': res.result.code == 200 ? 'success' : 'error',
                        })
                        this.loadOrderList()
                        return this.setState({ showOrderItem: false, waiting: false })
                      })
                  }}
                >
                  删除订单
                </Button>

                <Button
                  onClick={() => this.setState({ showOrderItem: false })}
                >关闭</Button>
              </AtModalAction>
            </AtModal> 

        <AtList>

          <View className='at-row'>
            <Picker mode='date' onChange={this.onStartDateChange}>
              <AtList>
                <AtListItem title='开始' extraText={this.state.startDate} />
              </AtList>
            </Picker>

            <Picker mode='date' onChange={this.onEndDateChange}>
              <AtList>
                <AtListItem title='结束' extraText={this.state.endDate} />
              </AtList>
            </Picker>
          </View>

          <View className='at-row'>
            <View className='at-col'>

              <AtButton
                className='sort-switch'
                onClick={() =>
                  this.setState({
                    orderList: this.state.orderList.reverse()
                  })}
              >顺序/倒序
              </AtButton>

            </View>

            <View className='at-col'>

              <AtButton
                className='sort-switch blue-button'
                onClick={() => this.loadOrderList()}
                type='primary'
              >
                查询</AtButton>
            </View>
          </View>

          {/* 是否没有订单 */}
          {this.state.orderList.length === 0 ?
            <View
              style={{
                textAlign: 'center'
              }}
            >
              什么都没有哦
            </View>
            :
            null}

          {
            this.state.orderList.map((item, index) => {
              return <AtListItem
                key={index}
                title={`【${parseInt(item.storeIndex) + 1}号门店】${dayjs(item.date).format('YYYY-MM-DD')}`}
                note={`${dayjs(item.submitTime).format('YYYY-MM-DD HH:mm:ss')}【${item.pay ? '已支付' : '未支付'}】`}
                arrow='right'
                onClick={
                  () => this.setState({ modalItem: item, showOrderItem: true })
                }
                iconInfo={item.pay ?
                  { size: 25, color: '#27ae60', value: 'check-circle' } :
                  { size: 25, color: '#e67e22', value: 'close-circle' }
                }
              />
            })
          }
        </AtList>
      </View >
    )
  }
}
