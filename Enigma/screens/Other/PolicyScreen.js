import React from "react";
import { StyleSheet, Text, View, ScrollView, Image } from "react-native";
import { colors } from "../../assets/colors";
import PolicyItem from "../../components/PolicyItem";

const policySections = [
    {
        title: "Chính sách Đăng bán sản phẩm",
        policies: [
            {
                policy: "Sản phẩm: Enigma chỉ cho phép đăng bán sản phẩm in theo yêu cầu (print-on-demand) được tạo ra bằng công cụ thiết kế của Enigma.",
            },
            {
                policy: "Nội dung: Nội dung trên sản phẩm phải tuân thủ các quy định về bản quyền, không vi phạm pháp luật, đạo đức xã hội, không có nội dung khiêu dâm, bạo lực, xúc phạm, hoặc vi phạm quyền riêng tư của cá nhân.",
            },
            {
                policy: "Trách nhiệm: Người bán hàng chịu trách nhiệm về chất lượng, độ chính xác của thông tin sản phẩm và nội dung được đăng bán.",
            },
        ],
    },
    {
        title: "Chính sách Mua hàng",
        policies: [
            {
                policy: "Sản phẩm: Enigma chỉ cho phép mua sản phẩm in theo yêu cầu (print-on-demand) được tạo ra bằng công cụ thiết kế của Enigma.",
            },
            {
                policy: "Hoàn tiền: Khách hàng có thể yêu cầu hoàn tiền trong vòng 7 ngày sau khi nhận được sản phẩm nếu sản phẩm bị lỗi do lỗi kỹ thuật của Enigma.",
            },
            {
                policy: "Giao hàng: Thời gian giao hàng phụ thuộc vào nhà cung cấp dịch vụ in ấn và địa điểm nhận hàng của khách hàng. Enigma sẽ cung cấp thông tin cập nhật về tình trạng giao hàng.",
            },
            {
                policy: "Bảo mật: Enigma cam kết bảo mật thông tin cá nhân của khách hàng theo chính sách bảo mật của ứng dụng.",
            },
        ],
    },
    {
        title: "Chính sách Bảo mật",
        policies: [
            {
                policy: "Thu thập và sử dụng dữ liệu: Enigma thu thập thông tin cá nhân của người dùng bao gồm email, số điện thoại, địa chỉ, thông tin thanh toán để xử lý đơn hàng, hỗ trợ khách hàng và cung cấp dịch vụ hiệu quả. Enigma không chia sẻ thông tin cá nhân của người dùng với bên thứ ba.",
            },
            {
                policy: "Bảo mật dữ liệu: Enigma cam kết bảo mật thông tin cá nhân của người dùng bằng cách sử dụng các biện pháp bảo mật kỹ thuật và thủ tục phù hợp để bảo vệ thông tin của người dùng khỏi truy cập trái phép, sử dụng, tiết lộ, sửa đổi hoặc phá hủy.",
            },
        ],
    },
    {
        title: "Chính sách Hỗ trợ",
        policies: [
            {
                policy: "Kênh hỗ trợ: Khách hàng có thể liên hệ với Enigma qua email, điện thoại hoặc trang web để được hỗ trợ.",
            },
            {
                policy: "Thời gian phản hồi: Enigma cam kết phản hồi yêu cầu hỗ trợ của khách hàng trong vòng 24 giờ làm việc.",
            },
        ],
    },
    {
        title: "Điều khoản Dịch vụ",
        policies: [
            {
                policy: "Sử dụng ứng dụng: Người dùng đồng ý tuân thủ các điều khoản và điều kiện sử dụng của Enigma.",
            },
            {
                policy: "Trách nhiệm: Enigma không chịu trách nhiệm về bất kỳ thiệt hại nào phát sinh từ việc sử dụng ứng dụng, bao gồm nhưng không giới hạn, thiệt hại do lỗi kỹ thuật, sự cố mạng, hoặc hành vi trái phép của người dùng.",
            },
        ],
    },
];

const PolicyScreen = () => {
    return (
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
            <View style={styles.container}>
                {policySections.map((section, index) => (
                    <View key={index}>
                        <Text style={styles.title}>{section.title}</Text>
                        {section.policies.map((item, itemIndex) => (
                            <PolicyItem
                                key={`${index}_${itemIndex}`}
                                policy={item.policy}
                            />
                        ))}
                    </View>
                ))}
            </View>
        </ScrollView>
    );
};

export default PolicyScreen;

const styles = StyleSheet.create({
    scrollViewContainer: {
        backgroundColor: colors.background.white_100,
        // padding: "5%",
    },
    container: {
        padding: "5%",
    },
    title: {
        color: colors.text.black_100,
        fontSize: 20,
        fontFamily: "helvetica-neue-bold",
        marginBottom: 15,
    },
    image: {
        width: "100%",
        height: 400,
        resizeMode: "contain",
        marginVertical: "5%",
    },
});
