import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import { useFonts } from "expo-font";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./services/firebase";
import {
	saveUserData,
	updateProducts,
	updateUserLikes,
	updateUsers,
} from "./redux/actions/userActions";
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
} from "firebase/firestore";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, Text, View } from "react-native";
import store from "./redux/stores/store";
import AppNavigator from "./routes/AppNavigator";
import AuthNavigator from "./routes/AuthNavigator";
import { colors } from "./assets/colors";

export default function App() {
	const [isLogin, setIsLogin] = useState(false);
	const [fontsLoaded] = useFonts({
		"helvetica-neue-black": require("./assets/fonts/HelveticaNeueBlack.otf"),
		"helvetica-neue-bold": require("./assets/fonts/HelveticaNeueBold.otf"),
		"helvetica-neue-heavy": require("./assets/fonts/HelveticaNeueHeavy.otf"),
		"helvetica-neue-light": require("./assets/fonts/HelveticaNeueLight.otf"),
		"helvetica-neue-medium": require("./assets/fonts/HelveticaNeueMedium.otf"),
		"helvetica-neue-regular": require("./assets/fonts/HelveticaNeueRoman.otf"),
		"helvetica-neue-thin": require("./assets/fonts/HelveticaNeueThin.otf"),
		"helvetica-neue-ultra-light": require("./assets/fonts/HelveticaNeueUltraLight.otf"),
	});

	// Function to convert Firestore timestamp to milliseconds since Unix epoch
	const convertFirestoreTimestampToMillis = (timestamp) => {
		return (
			timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000)
		);
	};

	// Function to convert timestamps in the products array to milliseconds
	const convertDateCreatedToMillis = (productsArray) => {
		return productsArray.map((product) => ({
			...product,
			dateCreated: convertFirestoreTimestampToMillis(product.dateCreated),
		}));
	};

	const convertCreatedAtToMillis = (usersArray) => {
		return usersArray.map((user) => ({
			...user,
			createdAt: convertFirestoreTimestampToMillis(user.createdAt),
		}));
	};

	useEffect(() => {
		const fetchProductData = async () => {
			try {
				const q = query(
					collection(db, "products"),
					orderBy("likedTotal", "desc")
				);
				const querySnapshot = await getDocs(q);
				const productsData = convertDateCreatedToMillis(
					querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
				store.dispatch(updateProducts(productsData));
			} catch (error) {
				console.error("Error fetching products:", error);
			}
		};

		const fetchUserData = async () => {
			try {
				const q = query(collection(db, "users"));
				const querySnapshot = await getDocs(q);
				const usersData = convertCreatedAtToMillis(
					querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}))
				);
				store.dispatch(updateUsers(usersData));
			} catch (error) {
				console.error("Error fetching users:", error);
			}
		};

		fetchProductData();
		fetchUserData();
	}, []);

	useEffect(() => {
		// Check if the user is remembered and attempt to log them in
		const checkLogin = async () => {
			const isRemembered = await AsyncStorage.getItem("isRemembered");
			if (isRemembered === "true") {
				const email = await AsyncStorage.getItem("email");
				const password = await AsyncStorage.getItem("password");
				if (email && password) {
					try {
						const userCredential = await signInWithEmailAndPassword(
							auth,
							email,
							password
						);
						const userDocSnap = await getDoc(
							doc(db, "users", userCredential.user.uid)
						);

						if (userDocSnap.exists()) {
							const userDoc = userDocSnap.data();
							const userData = {
								id: userCredential.user.uid,
								email: userDoc.email,
								name: userDoc.fullName,
								credit: userDoc.credit,
								likedProductId: userDoc.likedProductId,
								stabilityApiKey: userDoc.stabilityApiKey,
								userImage: userDoc.userImage,
							};
							store.dispatch(saveUserData(userData)); // Save user data to Redux store
							store.dispatch(updateUserLikes(userData.likedProductId)); // Update liked products in Redux store
							setIsLogin(true);
						}
					} catch (error) {
						console.error("Error signing in:", error);
						Toast.show({
							type: "error",
							text1: "Login Error",
							text2: "Failed to sign in. Please check your credentials.",
						});
					}
				}
			}
		};
		checkLogin();
	}, []);

	if (!fontsLoaded) {
		return null;
	}

	// Render the appropriate navigator based on login status
	return (
		<Provider store={store}>
			<NavigationContainer>
				{isLogin ? <AppNavigator /> : <AuthNavigator />}
				<Toast position="bottom" />
			</NavigationContainer>
		</Provider>
	);
}
