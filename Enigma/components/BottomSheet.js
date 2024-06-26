import React, { useCallback } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import {
	BottomSheetModal,
	BottomSheetBackdrop,
	BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useIsOpen } from "../utils/IsOpenContext";
const BottomSheet = ({
	bottomSheetRef,
	snapPoints,
	isVisible,
	onClose,
	children,
}) => {
	const { isOpen, setIsOpen } = useIsOpen();

	const renderBackdrop = useCallback(
		(props) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={1}
				animatedIndex={{
					value: 1,
				}}
			/>
		),
		[]
	);

	return (
		<BottomSheetModalProvider>
			<BottomSheetModal
				ref={bottomSheetRef}
				snapPoints={snapPoints}
				onChange={() => setIsOpen(true)}
				onDismiss={onClose}
				dismissOnPanDown={true}
				dismissOnTouchOutside={true}
				backdropComponent={renderBackdrop}
				enableContentPanningGesture={false}
			>
				<SafeAreaView style={styles.container}>{children}</SafeAreaView>
			</BottomSheetModal>
		</BottomSheetModalProvider>
	);
};

const styles = StyleSheet.create({
	bottomSheet: {
		borderRadius: 30,
	},
	container: {
		flex: 1,
		backgroundColor: "transparent",
	},
});

export default BottomSheet;
