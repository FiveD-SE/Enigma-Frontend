import { View, Text, ScrollView, StyleSheet, Image } from 'react-native'
import React from 'react'
import { colors } from '../../assets/colors'

const IMAGE = require("../../assets/images/enigma-background.jpg")
const ADD_CIRCLE = require("../../assets/images/add-circle.png")
const TYPE_OF_DESIGN = require("../../assets/images/choose-type-of-design.jpg")
const HOME = require("../../assets/images/home-screen.jpg")
const NOTIFICATION = require("../../assets/images/notification-screen.jpg")
const SELLING = require("../../assets/images/selling-screen.jpg")
const OTHER = require("../../assets/images/other-screen.jpg")

const TourGuideScreen = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.title}>Tạo sản phẩm hoặc đăng bán sản phẩm</Text>
        <Text style={styles.content}>Bước 1: Nhấn vào biểu tượng dấu cộng trong trang chủ.</Text>
        <Image source={ADD_CIRCLE} style={{ width: "100%", height: 50, resizeMode: 'contain', marginBottom: 10 }}/>
        <Text style={styles.content}>Bước 2: Tùy chọn hình thức thiết kế đặt hàng hoặc bán hàng.</Text>
        <Image source={TYPE_OF_DESIGN} style={{ width: "100%", height: 250, resizeMode: 'contain', marginBottom: 10 }}/>
        <Text style={styles.content}>Bước 3: Tiến hành thiết kế sản phẩm.</Text>
        <Text style={[styles.content, { marginBottom: 20 }]}>Bước 4: Hoàn thành quá trình thiết kế và kết thúc quá trình thông qua hành động mua hoặc đăng bán sản phẩm trên Enigma.</Text>

        <Text style={styles.title}>Giao diện chính của Enigma</Text>

        <Text style={styles.subTitle}>Trang chủ</Text>
        <Text style={styles.content}>Hiển thị danh mục các sản phẩm có trên Enigma.</Text>
        <Image source={HOME} style={styles.image} />

        <Text style={styles.subTitle}>Bán hàng</Text>
        <Text style={styles.content}>Hiển thị danh mục các sản phẩm bạn đã tạo trên Enigma.</Text>
        <Image source={SELLING} style={styles.image} />

        <Text style={styles.subTitle}>Thông báo</Text>
        <Text style={styles.content}>Hiển thị thông báo của Enigma.</Text>
        <Image source={NOTIFICATION} style={styles.image} />

        <Text style={styles.subTitle}>Khác</Text>
        <Text style={styles.content}>Hiển thị các danh mục khác có trên Enigma như thông tin đơn hàng, thông tin cá nhân người dùng, chính sách của ứng dụng Enigma và một vài thông tin hữu ích khác.</Text>
        <Image source={OTHER} style={styles.image} />
      </View>
    </ScrollView>
  )
}

export default TourGuideScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.white_100,
    padding: "5%",
  }, 
  title: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "helvetica-neue-bold",
    color: colors.text.black_100,
    marginBottom: "5%"
  },
  subTitle: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: "helvetica-neue-bold",
    color: colors.text.black_100,
    marginBottom: "5%"
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    color: colors.text.grey_100,
    marginBottom: 5
  },
  image: {
    width: "55%",
    height: 380,
    resizeMode: "contain",
    marginVertical: "5%",
    borderWidth: 2,
    borderColor: colors.background.black_20,
    borderRadius: 10,
    alignSelf: "center",
  },
});