import React from "react";
import { Animated, Image, StyleSheet, Dimensions, View } from "react-native";
import {
	PanGestureHandler,
	PinchGestureHandler,
	State,
	TapGestureHandler,
} from "react-native-gesture-handler";
import Slider from "@react-native-community/slider";

const DraggableAndScalableImage = ({ imageUri, scale }) => {
	let lastTranslateX = 0;
	let lastTranslateY = 0;
	let lastScale = 1;

	const translateX = new Animated.Value(0);
	const translateY = new Animated.Value(0);

	const imageContainerWidth = Dimensions.get("window").width * 0.9;
	const imageContainerHeight = Dimensions.get("window").height * 0.4;

	const minX = 0;
	const maxX = imageContainerWidth - 100;
	const minY = -100;
	const maxY = imageContainerHeight - 100;

	const onPanGestureEvent = (event) => {
		let x = event.nativeEvent.translationX + lastTranslateX;
		let y = event.nativeEvent.translationY + lastTranslateY;

		x = Math.min(Math.max(minX, x), maxX);
		y = Math.min(Math.max(minY, y), maxY);

		translateX.setValue(x);
		translateY.setValue(y);
	};

	const onPanStateChange = (event) => {
		if (event.nativeEvent.oldState === State.ACTIVE) {
			lastTranslateX += event.nativeEvent.translationX;
			lastTranslateY += event.nativeEvent.translationY;
		}
	};

	const onPinchStateChange = (event) => {
		if (event.nativeEvent.oldState === State.ACTIVE) {
			lastScale *= event.nativeEvent.scale;
		}
	};

	return (
		<View style={styles.container}>
			<Animated.View>
				<PanGestureHandler
					onGestureEvent={onPanGestureEvent}
					onHandlerStateChange={onPanStateChange}
				>
					<Animated.View
						style={{ transform: [{ translateX }, { translateY }] }}
					>
						<PinchGestureHandler onHandlerStateChange={onPinchStateChange}>
							<Animated.View style={{ transform: [{ scale }] }}>
								<Image source={{ uri: imageUri }} style={styles.image} />
							</Animated.View>
						</PinchGestureHandler>
					</Animated.View>
				</PanGestureHandler>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		width: 100,
		height: 100,
		resizeMode: "contain",
	},
	slider: {
		width: 200,
		height: 40,
	},
});

export default DraggableAndScalableImage;
