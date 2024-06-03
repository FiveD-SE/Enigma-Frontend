import {
    Platform,
    SafeAreaView,
    StyleSheet,
    View,
    FlatList,
    Text,
    Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../assets/colors";
import SearchBar from "../../components/SearchBar";
import unidecode from "unidecode";
import ShopPostCard from "../../components/ShopPostCard";
import { useNavigation } from "@react-navigation/native";
import {
    collection,
    getDocs,
    where,
    query,
    onSnapshot,
} from "firebase/firestore";
import { connect } from "react-redux";
import { db } from "../../services/firebase";

const isAndroid = Platform.OS === "android";

const ShopScreen = ({ userData }) => {
    const navigation = useNavigation();
    const [allProducts, setAllProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            if (userData.id) {
                try {
                    const q = query(collection(db, 'products'), where('userId', '==', userData.id));
                    const unsub = onSnapshot(q, (snapshot) => {
                        const dataList = snapshot.docs.map((doc) => ({
                            id: doc.id,
                            ...doc.data(),
                        }));
                        setAllProducts(dataList);
                        setFilteredProducts(dataList);
                    });
                } catch (error) {
                    console.error('Error fetching data: ', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchData();
    }, [userData.id]);

    useEffect(() => {
        const normalizedSearchText = unidecode(searchQuery.toLowerCase().trim());
        const filteredList = allProducts.filter((item) =>
            unidecode(item.productName.toLowerCase()).includes(normalizedSearchText)
        );
        setFilteredProducts(filteredList);
    }, [searchQuery, allProducts]);

    const handleLikePress = () => {
		
	};

    const renderShopPostCard = ({ item }) => (
        <View style={styles.cardContainer}>
            <ShopPostCard
                postName={item.productName}
                postPrice={item.productPrice}
                postImage={item.imageFront}
                totalLikes={item.likedTotal}
                onPress={() => navigation.navigate("EditItemDetail", item)}
            />
        </View>
    );

    const renderView = () => {
        if (filteredProducts.length > 0) {
            return (
                <FlatList
                    data={filteredProducts}
                    renderItem={renderShopPostCard}
                    keyExtractor={(item) => item.id}
                    numColumns={2}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                />
            );
        } else {
            return (
                <View style={styles.noProductContainer}>
                    <Image
                        source={require("../../assets/images/no-items-found.png")}
                        style={styles.noProductImage}
                    />
                    <Text style={styles.noProductText}>
                        Bạn chưa tạo sản phẩm nào, hãy bấm dấu cộng bên dưới để tạo sản phẩm
                    </Text>
                </View>
            );
        }
    };

    const handleSearch = (text) => {
        setSearchQuery(text);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <SearchBar onChangeText={handleSearch} />
            </View>
            <View style={styles.main}>{renderView()}</View>
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    product: state.user.product,
    userData: state.auth.userData,
});
export default connect(mapStateToProps)(ShopScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    header: {
        padding: "5%",
        marginTop: isAndroid ? "10%" : "0%",
    },
    main: {
        flex: 1,
        paddingBottom: "5%",
        paddingHorizontal: "5%",
    },
    row: {
        justifyContent: "space-between",
    },
    cardContainer: {
        flex: 1,
        margin: "2%",
    },
    noProductContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    noProductImage: {
        width: "100%",
        height: "20%",
        marginBottom: 20,
        resizeMode: "contain",
    },
    noProductText: {
        textAlign: "center",
        color: colors.text.grey_100,
        fontFamily: "helvetica-neue-bold",
        fontSize: 16,
        lineHeight: 24,
    },
});
