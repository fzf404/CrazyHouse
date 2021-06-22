import Taro from '@tarojs/taro'
import dayjs from 'dayjs';
import { Component } from 'react'
import { View, Button } from '@tarojs/components'

import { AtToast, AtList, AtListItem, AtModal, AtModalHeader, AtModalContent, AtModalAction, AtMessage } from 'taro-ui'



import './index.scss'

export default class Index extends Component {
  state = {
    orderList: [],
    modalItem: {},
    showOrderItem: false,
    waiting: false
  }



  componentWillMount() {
    this.loadOrderList()
  }


  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  loadOrderList = () => {

    this.setState({ waiting: true })

    const scheduleDB = Taro.cloud.database().collection('schedules')
    scheduleDB.get({
      success: (res) => {
        res.data.reverse()
        res.data.forEach((item, index) => {
          res.data[index].date = item.date.toString()
        })
        this.setState({ orderList: res.data, waiting: false })
      }
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

        {/* 是否没有订单 */}
        {this.state.orderList.length === 0 ?
          <View style={{ textAlign: 'center' }}>
            什么都没有哦
          </View>
          :
          null}

        {
          this.state.showOrderItem ?
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
                {
                  this.state.modalItem.pay ? null :
                    <Button
                      onClick={() => {
                        this.setState({ waiting: true })
                        const scheduleDB = Taro.cloud.database().collection('schedules')
                        scheduleDB.where({
                          pay: false
                        }).remove()
                          .then(() => {
                            Taro.atMessage({
                              'message': '删除成功',
                              'type': 'success',
                            })
                            this.loadOrderList()
                            this.setState({ showOrderItem: false, waiting: false })
                          })
                      }
                      }
                    >删除订单</Button>
                }
                <Button
                  onClick={() => this.setState({ showOrderItem: false })}
                >关闭</Button>
              </AtModalAction>
            </AtModal> :
            null
        }

        <AtList>
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
