import { Component } from 'react'
import { View } from '@tarojs/components'

import './index.scss'

export default class Index extends Component {

  render() {
    return (
      <View className='container' >
        <View className='at-article'>
          <View className='at-article__h1'>
            帮助信息
          </View>
          <View className='at-article__info'>
            2021-06-22&nbsp;&nbsp;&nbsp;疯房子轰趴馆官方
          </View>
          <View className='at-article__content'>
            <View className='at-article__section'>
              <View className='at-article__h2'>常见问题</View>
              <View className='at-article__h3'>1.&nbsp;之前在别的平台预定过但不是会员？</View>
              <View className='at-article__p'>
                <View>
                  1、进入个人中心，点击&quot;普通用户&quot;标签。
                </View>
                <View>
                  2、提示&quot;内容已复制&quot;后，回到首页点联系我们添加店长微信。
                </View>
                <View>
                  注: 如在首次登录后点击无提示，请在后台中退出小程序，重新进入。
                </View>
                <View>
                  3、将复制的内容及之前的预定信息发送给店长，店长为您开通VIP
                </View>
              </View>

              {/* <Image
                className='at-article__img'
                src='https://jdc.jd.com/img/400x400'
                mode='widthFix'
              /> */}
            </View>
          </View>
        </View>
      </View >
    )
  }
}

