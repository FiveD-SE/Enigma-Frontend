import React, {
    useCallback,
    useEffect,
    useLayoutEffect,
    useState,
} from "react";
import { View, StyleSheet, FlatList } from "react-native";
import PostCard from "../../../components/PostCard";
import { colors } from "../../../assets/colors";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
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
import { db } from "../../../services/firebase";
import { connect } from "react-redux";
import {
    updateProducts,
    updateUserLikes,
    updateUsers,
} from "../../../redux/actions/userActions";

const TrendingTab = ({
    userData,
    products,
    users,
    likedProducts,
    updateProducts,
    updateUsers,
    updateUserLikes,
}) => {
    const navigation = useNavigation();
    const [numColumns, setNumColumns] = useState(2);
    const [loading, setLoading] = useState(true);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);



    // Function to convert Firestore timestamp to milliseconds since Unix epoch
    const convertFirestoreTimestampToMillis = (timestamp) => {
        return (
            timestamp.seconds * 1000 +
            Math.floor(timestamp.nanoseconds / 1000000)
        );
    };

    // Function to convert timestamps in the products array to milliseconds
    const convertDateCreatedToMillis = (productsArray) => {
        return productsArray.map((product) => {
            return {
                ...product,
                dateCreated: convertFirestoreTimestampToMillis(
                    product.dateCreated
                ),
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

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                const q = query(
                    collection(db, "products"),
                    orderBy("likedTotal", "desc")
                );
                const querySnapshot = await getDocs(q);
                const dataList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                const productsData = convertDateCreatedToMillis(dataList);
                updateProducts(productsData);

                setLoading(false);
            };
            fetchData();
        }, [])
    );

    const fetchData = async () => {
        const q = query(
            collection(db, "products"),
            orderBy("likedTotal", "desc")
        );
        const querySnapshot = await getDocs(q);
        const dataList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        const productsData = convertDateCreatedToMillis(dataList);
        updateProducts(productsData);

        setLoading(false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData();
        setRefreshing(false);
    };

    const handleLikePress = async (productId) => {
        const isLiked = likedProducts.includes(productId);

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
        updateUserLikes(newLikedProducts);
        updateProducts(newProducts);

        try {
            const userQuery = query(
                collection(db, "users"),
                where("userId", "==", userData.id)
            );

            const userSnapshot = await getDocs(userQuery);
            if (userSnapshot.empty) {

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
                            likedTotal:
                                product.likedTotal - (isLiked ? -1 : 1),
                        }
                        : product
                )
            );
        }
    };

    const handleBuyPress = (item) => {
        navigation.navigate("ItemDetail", { productId: item.id });
    };

    const getUserName = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user ? user.fullName : "Unknown User";
    };

    const getUserImage = (userId) => {
        const user = users.find((user) => user.id === userId);
        return user.userImage;
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={products}
                refreshing={refreshing}
                onRefresh={() => handleRefresh()}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.productId}
                renderItem={({ item }) => (
                    <PostCard
                        userName={getUserName(item.userId)}
                        productName={item.productName}
                        totalLikes={item.likedTotal}
                        onLikePress={() => handleLikePress(item.id)}
                        onBuyPress={() => handleBuyPress(item)}
                        userImage={getUserImage(item.userId)}
                        postImage={item.imageFront}
                        onItemPress={() => handleBuyPress(item)}
                        liked={likedProducts.includes(item.productId)}
                    />
                )}
                contentContainerStyle={{
                    paddingBottom: "15%",
                }}
                numColumns={numColumns}
                key={numColumns}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: "2%",
        backgroundColor: colors.background.white_100,
    },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(TrendingTab);
