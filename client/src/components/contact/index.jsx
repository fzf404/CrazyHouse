import { Component } from 'react'
import { Image, Text, Button } from '@tarojs/components'
import { AtModal, AtModalHeader, AtModalContent, AtModalAction } from "taro-ui"

export default class Index extends Component {
  render() {
    return <AtModal 
      isOpened={this.props.showQRCode}
      onClose={()=>this.props.close()}
    >
      <AtModalHeader>添加微信</AtModalHeader>
      <AtModalContent>
        <Image style='width:100%' src={this.props.QRcodeImg?this.props.QRcodeImg:'cloud://production-4gh3g3wq4acaed67.7072-production-4gh3g3wq4acaed67-1306247830/basic-img/manager-wx.jpg'} />

        <Text style='margin-left:10%'>
          {this.props.info}
        </Text>
      </AtModalContent>
      <AtModalAction>
        <Button
          onClick={() => {
            this.props.close()
          }}
        >确定</Button>
      </AtModalAction>
    </AtModal>
  }
}
