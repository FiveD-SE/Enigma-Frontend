import { StyleSheet, View, Image, FlatList, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../../assets/colors";
import { useNavigation } from "@react-navigation/native";
import { connect } from "react-redux";
import {
    updateProducts,
    updateUserLikes,
    updateUsers,
} from "../../redux/actions/userActions";
import FavoriteCard from "../../components/FavoriteCard";
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    updateDoc,
    where,
    getDocs,
    arrayUnion,
    arrayRemove,
    increment,
} from "firebase/firestore";
import { db } from "../../services/firebase";

const USER_IMAGE_SOURCE = require("../../assets/images/user.png");

const FavoriteScreen = ({ userData, products, likedProducts, users, updateProducts, updateUsers, updateUserLikes }) => {
    console.log("User data: ", userData);
    const navigation = useNavigation();
    const data = Array.from(Array(20).keys());
    const [listFavorite, setListFavorite] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    // Function to convert Firestore timestamp to milliseconds since Unix epoch
    const convertFirestoreTimestampToMillis = (timestamp) => {
        return (
            timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
        );
    };

    // Function to convert timestamps in the products array to milliseconds
    const convertDateCreatedToMillis = (productsArray) => {
        return productsArray.map((product) => {
            return {
                ...product,
                dateCreated: convertFirestoreTimestampToMillis(product.dateCreated),
            };
        });
    };

    const convertCreatedAtToMillis = (usersArray) => {
        return usersArray.map((user) => {
            return {
                ...user,
                createdAt: convertFirestoreTimestampToMillis(user.createdAt),
            };
        });
    };

    useEffect(() => {
        const filteredProducts = products.filter((product) =>
            likedProducts.includes(product.productId)
        );
        setListFavorite(filteredProducts);
    }, []);

    useEffect(() => { }, [listFavorite]);

    const fetchData = () => {
        const fetchProductData = async () => {
            const q = query(collection(db, "products"), orderBy("likedTotal", "desc"));
            const querySnapshot = await getDocs(q);
            const dataList = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            const productsData = convertDateCreatedToMillis(dataList);
            updateProducts(productsData);
            setListFavorite(productsData.filter((product) => likedProducts.includes(product.productId)))
        }
        fetchProductData();
        console.log("Reload")
    }
    const handleOnRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    }
    const handleLikedPress = async (productId) => {
        const isLiked = likedProducts.includes(productId);
        console.log("Button is cliked");
        console.log("isLiked: ", isLiked);
        console.log("likedProducts: ", likedProducts);
        const newLikedProducts = isLiked
            ? likedProducts.filter((id) => id !== productId)
            : [...likedProducts, productId];

        const newProducts = products.map((product) =>
            product.id === productId
                ? {
                    ...product,
                    likedTotal: product.likedTotal + (isLiked ? -1 : 1),
                }
                : product
        );
        const newFavoriteProducts = listFavorite.map((product) =>
            product.id === productId
                ? {
                    ...product,
                    likedTotal: product.likedTotal + (isLiked ? -1 : 1),
                }
                : product
        );
        updateProducts(newProducts);
        updateUserLikes(newLikedProducts);
        setListFavorite(newFavoriteProducts);

        try {
            const userQuery = query(
                collection(db, "users"),
                where("userId", "==", userData.id)
            );

            const userSnapshot = await getDocs(userQuery);
            if (userSnapshot.empty) {
                console.log("No matching user documents.");
                return;
            }

            const userDoc = userSnapshot.docs[0];
            const userRef = userDoc.ref;

            const productQuery = query(
                collection(db, "products"),
                where("productId", "==", productId)
            );

            const productSnapshot = await getDocs(productQuery);
            if (productSnapshot.empty) {
                console.log("No matching product documents.");
                return;
            }

            const productDoc = productSnapshot.docs[0];
            const productRef = productDoc.ref;

            if (isLiked) {
                await updateDoc(userRef, {
                    likedProductId: arrayRemove(productId),
                });
                await updateDoc(productRef, {
                    likedTotal: increment(-1),
                });
            } else {
                await updateDoc(userRef, {
                    likedProductId: arrayUnion(productId),
                });
                await updateDoc(productRef, {
                    likedTotal: increment(1),
                });
            }
        } catch (error) {
            console.error("Error updating document: ", error);

            updateUserLikes(
                isLiked
                    ? [...likedProducts, productId]
                    : likedProducts.filter((id) => id !== productId)
            );
            updateProducts(
                products.map((product) =>
                    product.id === productId
                        ? {
                            ...product,
                            likedTotal: product.likedTotal - (isLiked ? -1 : 1),
                        }
                        : product
                )
            );
        }

    }

    const goToItemDetails = (productId) => {
        navigation.navigate("ItemDetail", { productId: productId });
    };

    const getUserName = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.fullName : "Unknown User";
    };

    const renderItem = ({ item }) => {
        return (
            <FavoriteCard
                onLikedPress={() => handleLikedPress(item.productId)}
                userName={getUserName(item.userId)}
                userImage={USER_IMAGE_SOURCE}
                postName={item.productName}
                postPrice={item.productPrice}
                postImage={item.imageFront}
                totalLikes={item.likedTotal}
                liked={likedProducts.includes(item.productId)}
                onPress={() => goToItemDetails(item.productId)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <FlatList
                refreshing={refreshing}
                onRefresh={() => handleOnRefresh()}
                data={listFavorite}
                keyExtractor={(item) => item.productId}
                renderItem={renderItem}
                contentContainerStyle={styles.flatListContent}
            />
        </View>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
    products: state.user.products,
    users: state.user.users,
    likedProducts: state.user.userLikes,
});

const mapDispatchToProps = {
    updateUsers,
    updateUserLikes,
    updateProducts,
};

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background.white_100,
    },
    flatListContent: {
        paddingHorizontal: 8,
        paddingVertical: 16,
    },
    imageContainer: {
        flex: 1,
        aspectRatio: 1,
        margin: "1%",
    },
    image: {
        width: "100%",
        height: "100%",
    },
});
