import { Component } from 'react'
import { View } from '@tarojs/components'
import { AtToast, AtButton } from 'taro-ui'
import Taro from '@tarojs/taro'
import dayjs from 'dayjs'

import AtCalendar from '../../components/calendar'


import './index.scss'

export default class Index extends Component {
  state = {
    selectDate: null,
    validDates: [],
    waiting: false,
  }

  componentWillMount() {
    const storeIndex = Taro.getCurrentInstance().router.params.storeIndex
    this.setState({ waiting: true })
    // 查询云端预定信息
    Taro.cloud
      .callFunction({
        name: "order",
        data: {
          storeIndex
        }
      }).then(res => {
        const reserveList = res.result.data
        let validDates = []
        reserveList.forEach(item => {
          validDates.push(item.date.toString())
        })
        this.setState({ validDates: validDates, waiting: false })
      })

  }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  onChange = (val) => {
    this.setState({
      selectDate: val.value.start
    })
  }

  handleSelectDate = () => {
    Taro.getCurrentPages()[0].setData({
      selectDate: this.state.selectDate,
    })
    Taro.navigateBack({
      delta: 1
    })
  }






  render() {
    return (
      <View className='container' >
        {/* 加载提示  */}
        <AtToast
          isOpened={this.state.waiting}
          text='加载中...'
          icon='loading-2'
        />

        <AtCalendar
          onSelectDate={this.onChange}
          minDate={dayjs().format('YYYYMMDD')}
          validDates={this.state.validDates}
        />

        <AtButton
          className='select-button'
          type='primary'
          onClick={this.handleSelectDate}
        >
          选定</AtButton>
      </View >
    )
  }
}

