import { FlatList, Pressable, StyleSheet, Text, View, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import unidecode from "unidecode";
import SearchBar from "../../components/SearchBar";
import { colors } from "../../assets/colors";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../services/firebase";

const SearchScreen = () => {
    const navigation = useNavigation();

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProductList, setFilteredProductList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleGoBack = () => {
        navigation.goBack();
    };

    const handleSearch = (text) => {
		setSearchQuery(text);
		const normalizedSearchText = unidecode(text.toLowerCase().trim());
		const filteredList = productList.filter((item) =>
			item.productName && unidecode(item.productName.toLowerCase()).includes(normalizedSearchText)
		);
		setFilteredProductList(filteredList);
	};	

	const handleItemPress = (item) => {
		if (item) {
			navigation.navigate("ItemDetail", { productId: item.productId });
		}
	};
	
	const renderItemList = ({ item }) => {
		return (
			<Pressable
				style={styles.itemContainer}
				onPress={() => handleItemPress(item)}
				hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
			>
				<Image style={styles.itemImage} source={{ uri: item.imageFront }} />
			</Pressable>
		);
	};

    const fetchData = async () => {
        try {
            const q = query(collection(db, 'products'));
            const snapshot = await getDocs(q);
            const dataList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setProductList(dataList);
        } catch (error) {
            console.error('Error fetching data: ', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={{ flex: 1 }}>
                    <SearchBar onChangeText={handleSearch} />
                </View>
                <Pressable
                    style={styles.cancelButton}
                    onPress={handleGoBack}
                    hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                    <Text style={styles.cancelButtonText}>Huỷ</Text>
                </Pressable>
            </View>
            <View style={styles.main}>
                <FlatList
                    data={searchQuery ? filteredProductList : productList}
                    renderItem={renderItemList}
                    showsVerticalScrollIndicator={false}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    columnWrapperStyle={styles.row}
                />
            </View>
        </View>
    );
};

export default SearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    header: {
        width: "100%",
        flexDirection: "row",
        padding: "5%",
        alignItems: "center",
        marginTop: "10%",
    },
    cancelButton: {
        marginLeft: "5%",
    },
    cancelButtonText: {
        color: colors.text.black_100,
        fontSize: 12,
        fontFamily: "helvetica-neue-bold",
    },
    main: {
        flex: 1,
        backgroundColor: "#F8F7FA",
        padding: "5%",
    },
    row: {
        flex: 1,
        justifyContent: "space-between",
    },
    itemContainer: {
        width: "48%",
        height: 200,
        marginBottom: "5%",
        backgroundColor: "#FFFFFF",
    },
    itemImage: {
        width: "100%",
        height: "100%",
        borderRadius: 8,
    },
});
