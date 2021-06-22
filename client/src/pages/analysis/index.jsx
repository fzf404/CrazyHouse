import { Picker, View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'
import { Component } from 'react'
import { AtButton, AtList, AtListItem, AtToast } from 'taro-ui'
import './index.scss'




export default class Index extends Component {

  state = {

    startDate: dayjs().subtract(1, 'month').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),

    income: null,
    number: null,

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
        name: "analysis",
        data: {
          startDate: parseInt(this.state.startDate.replace(/-/g, '')),
          endDate: parseInt(this.state.endDate.replace(/-/g, ''))
        }
      }).then(res => {

        this.setState({
          ...res.result,
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

        {/* 加载中 */}
        <AtToast
          isOpened={this.state.waiting}
          text='加载中...'
          icon='loading-2'
        />

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
              className='sort-switch blue-button'
              onClick={() => this.loadOrderList()}
              type='primary'
            >
              查询</AtButton>
          </View>
        </View >

        {/* 是否加载 */}
        {this.state.income ?
          <View className='at-article'>
            <View className='at-article__h2'>收入</View>
            <View className='at-article__h3'>
              {this.state.income}
            </View>
            <View className='at-article__h2'>售出日期</View>
            <View className='at-article__h3'>
              {this.state.number}
            </View>
          </View>
          :
          <View
            style={{
              textAlign: 'center'
            }}
          >
            什么都没有哦
          </View>
        }

      </View >
    )
  }
}
