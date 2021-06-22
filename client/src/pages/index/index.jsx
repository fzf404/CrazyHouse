import { Component } from 'react'
import { View, Image, Text, Swiper, SwiperItem } from '@tarojs/components'
import { AtButton, AtNoticebar, AtIcon, AtToast } from 'taro-ui'
import Taro from '@tarojs/taro'

import QRcode from '../../components/contact'


import './index.scss'

class Index extends Component {
  constructor() {
    super(...arguments)
    this.state = {
      showTip: false,
      showQRCode: false
    }
  }


  componentWillMount() { }

  componentDidMount() { }

  componentWillUnmount() { }

  componentDidShow() { }

  componentDidHide() { }

  handleReserve = () => {
    const point = Taro.getStorageSync('point')
    if (point.length != 0) {
      Taro.navigateTo({
        url: '/pages/reserve/index'
      })
    } else {
      this.setState({ showTip: true })
      setTimeout(() => this.setState({ showTip: false }), 1000)
    }
  }

  handleQRClose() {
    this.setState({ showQRCode: false })
  }

  render() {
    return (
      <View className='container'>

        {/* 展示店长微信 */}
        <QRcode showQRCode={this.state.showQRCode} close={this.handleQRClose.bind(this)} info='截屏后回到微信扫一扫添加店长' />

        {/* 加载中 */}
        <AtToast
          isOpened={this.state.showTip}
          text='请先到个人中心登录哦~'
          icon='blocked'
        />

        <Image className='head-img' src='cloud://production-4gh3g3wq4acaed67.7072-production-4gh3g3wq4acaed67-1306247830/basic-img/index-bg.svg' />
        <View className='index-container'>

          <View className='index-choice'>
            <AtIcon value='map-pin' size='26' color='#666' />
            <Text style='color: #454545; font-size:36rpx'> 疯房子轰趴馆</Text>
          </View>

          <View className='.index-notice'>
            <AtNoticebar icon='volume-plus' marquee>
              工作日1280/天，周末及法定假日1580/天。会员9折。
            </AtNoticebar>
          </View>

          <AtButton
            type='primary'
            className='index-reserve-button'
            onClick={this.handleReserve}
          >
            立 即 预 定
          </AtButton>

          <View className='index-ch'>
            <AtButton
              type='primary'
              className='ch-item index-contact-button'
              onClick={() => this.setState({ showQRCode: true })}
            >
              <Image src='cloud://production-4gh3g3wq4acaed67.7072-production-4gh3g3wq4acaed67-1306247830/basic-img/phone.png'></Image>
            </AtButton>
            <AtButton
              type='primary'
              className='ch-item index-help-button'
              onClick={() => Taro.navigateTo({
                url: '/pages/help/index'
              })}
            >
              <Image src='cloud://production-4gh3g3wq4acaed67.7072-production-4gh3g3wq4acaed67-1306247830/basic-img/help.png'></Image>
            </AtButton>
          </View>
          <View className='at-row'>
            <View className='at-col ch-text' style='margin: 16rpx 20rpx 0 50rpx;'>联 系 我 们</View>
            <View className='at-col ch-text' style='margin: 16rpx 50rpx 0 20rpx;'>帮&emsp;助</View>
          </View>

        </View>

        <View className='info-container'>

          <View className='info-text' style='margin-top : 30rpx;'>
            详&emsp;情
          </View>
          <View className='info-text'>
            ︾
          </View>
          <Swiper
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay
            className='image-show'
          >
            <SwiperItem>
              <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
            </SwiperItem>
            <SwiperItem>
              <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
            </SwiperItem>
          </Swiper>
          <View>
            <View className='at-article__h1'>门店1</View>
            <View className='at-article__h2'>简介</View>

            <View className='at-article__p' >
              &emsp;&emsp;Crazy House (疯房子) 大型轰趴别墅，您的乐享家园。
              别墅内绿野仙踪、3D世界、复古情怀、墨香茶楼，定让您穿越时空、惊喜不断。
              别墅共400平，KTV+巨幕影院+麻将+台球+各种桌游+大型动漫游戏机+体感游戏机+茶室+淋浴+客房等多功能，
              是您团队出游、家庭朋友聚会、生日PT、同学聚会、公司聚会和各协会聚会的去处。
            </View>


            <View className='at-article__h2'>详情</View>

            <View className='at-article__desp'>
              <View>户型：7室4厅1厨4卫</View>
              <View >房屋面积：400㎡</View>
              <View >可住人数：25人</View>
              <View>位置：辽宁，沈阳，浑南区，双园路</View>
            </View>

            <View className='at-article__h2'>图片欣赏</View>

            <Swiper
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay
              className='image-show'
              style={{
                marginTop: '20rpx'
              }}
            >
              <SwiperItem>
                <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
              </SwiperItem>
              <SwiperItem>
                <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
              </SwiperItem>
              <SwiperItem>
                <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
              </SwiperItem>
            </Swiper>
          </View>

          <View>

            <View className='at-article__h1'>门店2</View>
            <View className='at-article__h2'>简介</View>

            <View className='at-article__p' >
              &emsp;&emsp;沈阳Crazy House疯房子轰趴馆二部，疯趴超大型轰趴俱乐部。建筑面积600多平方米,前后院落2000余平方米，春季可提供会员认领
              地块耕种自己动手秋季果实熟了，自己采摘。夏季院内百余颗葡萄树、苹果树、梨树、李子、桃树、樱桃树可供游客品尝。
              绿色无污染蔬菜应有尽.可提供烤全羊、炖笨鸡、炖大鹅、农家笨鸡蛋等!
              秋季可提供游客采摘提供厨房你可以自己下厨亲手做出属于自己的美味!
              冬季院内可提供小型雪地摩托爬犁堆雪人等各种娱乐!
            </View>


            <View className='at-article__h2'>详情</View>

            <View className='at-article__desp'>
              <View>户型：7室5厅1厨3卫</View>
              <View >房屋面积：600㎡</View>
              <View >可住人数：40人</View>
              <View>位置：辽宁，沈阳，浑南区，满堂乡</View>
            </View>

            <View className='at-article__h2'>图片欣赏</View>

            <Swiper
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay
              className='image-show'
              style={{
                marginTop: '20rpx'
              }}
            >
              <SwiperItem>
                <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
              </SwiperItem>
              <SwiperItem>
                <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
              </SwiperItem>
              <SwiperItem>
                <Image src='https://z3.ax1x.com/2021/06/02/2Q7p1U.jpg' />
              </SwiperItem>
            </Swiper>
          </View>

        </View>
      </View >
    )
  }
}

export default Index