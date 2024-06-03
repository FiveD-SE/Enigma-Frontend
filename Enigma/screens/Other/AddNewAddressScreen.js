import React, { useRef, useState, useEffect } from "react";
import { Pressable, StyleSheet, View, Platform, ScrollView } from "react-native";
import { colors } from "../../assets/colors";
import CustomInput from "../../components/CustomInput";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import CustomButton from "../../components/CustomButton";
import {
    getDistricts,
    getProvinces,
    getWards,
} from "../../services/ghnService";
import { connect } from "react-redux";
import Toast from "react-native-toast-message";
import { db } from "../../services/firebase";
import { collection, addDoc, updateDoc, doc, query, where, getDocs } from "firebase/firestore";

const inputInfo = [
    {
        label: "Họ và tên",
        placeholder: "Nhập họ tên người nhận",
        type: "text",
        name: "name",
    },
    {
        label: "Số điện thoại",
        placeholder: "Nhập số điện thoại người nhận(10 chữ số)",
        type: "text",
        name: "phoneNumber",
    },
    {
        label: "Tỉnh/Thành phố",
        placeholder: "Chọn Tỉnh/Thành phố",
        type: "dropdown",
        name: "province",
    },
    {
        label: "Quận/Huyện",
        placeholder: "Chọn Quận/Huyện",
        type: "dropdown",
        name: "district",
    },
    {
        label: "Phường/Xã",
        placeholder: "Chọn Phường/Xã",
        type: "dropdown",
        name: "ward",
    },
    {
        label: "Địa chỉ cụ thể",
        placeholder: "Nhập thông tin địa chỉ cụ thể",
        type: "text",
        name: "street",
    },
];

const AddNewAddressScreen = ({ userData }) => {
    const route = useRoute();
    const addressInfo = route.params || {};
    const [selectedIds, setSelectedIds] = useState({
        provinceId: null,
        districtId: null,
        wardId: null,
        name: "",
        phoneNumber: "",
        provinceName: "",
        districtName: "",
        wardName: "",
        street: "",
        isDefault: false,
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        const checkDefaultAddress = async () => {
            try {
                const q = query(collection(db, "addresses"), where("userId", "==", userData.id));
                const querySnapshot = await getDocs(q);
                const existingAddresses = querySnapshot.docs.map((doc) => doc.data());
                const hasExistingAddress = existingAddresses.length > 0;
                const isFirstAddress = !hasExistingAddress;

                if (isFirstAddress) {
                    setSelectedIds((prevIds) => ({
                        ...prevIds,
                        isDefault: true,
                    }));
                }
            } catch (error) {
                console.log("Lỗi khi kiểm tra địa chỉ:", error);
            }
        };

        checkDefaultAddress();
    }, [userData.id]);

    // Fetch Provinces
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getProvinces();
                const sortedProvinces = response.data
                    .map((province) => ({
                        label: province.ProvinceName,
                        value: province.ProvinceID,
                    }))
                    .sort((a, b) => a.label.localeCompare(b.label));
                setProvinces(sortedProvinces);
            } catch (error) {
                console.log("Error fetching provinces:", error);
            }
        };
        fetchData();
    }, []);

    // Fetch Districts
    useEffect(() => {
        if (selectedIds.provinceId) {
            const fetchDistricts = async () => {
                try {
                    const response = await getDistricts({ province_id: selectedIds.provinceId });
                    const sortedDistricts = response.data
                        .map((district) => ({
                            label: district.DistrictName,
                            value: district.DistrictID,
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setDistricts(sortedDistricts);
                } catch (error) {
                    console.log("Error fetching districts:", error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]);
            setWards([]);
        }
    }, [selectedIds.provinceId]);

    // Fetch Wards
    useEffect(() => {
        if (selectedIds.districtId) {
            const fetchWards = async () => {
                try {
                    const response = await getWards({ district_id: selectedIds.districtId });
                    const sortedWards = response.data
                        .map((ward) => ({
                            label: ward.WardName,
                            value: ward.WardCode,
                        }))
                        .sort((a, b) => a.label.localeCompare(b.label));
                    setWards(sortedWards);
                } catch (error) {
                    console.log("Error fetching wards:", error);
                }
            };
            fetchWards();
        } else {
            setWards([]);
        }
    }, [selectedIds.districtId]);

    const handleInputChange = async (name, value) => {
        let label = "";
        if (name === "provinceId") {
            const province = provinces.find((province) => province.value === value);
            label = province ? province.label : "";
            setSelectedIds((prevIds) => ({
                ...prevIds,
                provinceId: value,
                provinceName: label,
                districtId: null, // Reset district when province changes
                districtName: "",
                wardId: null, // Reset ward when province changes
                wardName: "",
            }));
        } else if (name === "districtId") {
            const district = districts.find((district) => district.value === value);
            label = district ? district.label : "";
            setSelectedIds((prevIds) => ({
                ...prevIds,
                districtId: value,
                districtName: label,
                wardId: null, // Reset ward when district changes
                wardName: "",
            }));
        } else if (name === "wardId") {
            const ward = wards.find((ward) => ward.value === value);
            label = ward ? ward.label : "";
            setSelectedIds((prevIds) => ({
                ...prevIds,
                wardId: value,
                wardName: label,
            }));
        } else {
            setSelectedIds((prevIds) => ({ ...prevIds, [name]: value }));
        }
    };    

    const renderInputInfo = () => {
        return inputInfo.map((input, index) => (
            <View style={{ marginBottom: "3%" }} key={index}>
                <CustomInput
                    label={input.label}
                    placeholder={input.placeholder}
                    Value={selectedIds[input.name]}
                    type={input.type}
                    datalist={
                        input.name === "province"
                            ? provinces
                            : input.name === "district"
                                ? districts
                                : input.name === "ward"
                                    ? wards
                                    : []
                    }
                    onValueChange={(value) => handleInputChange(input.type === "dropdown" ? `${input.name}Id` : input.name, value)}
                />
            </View>
        ));
    };

    const handleSaveNewAddress = async () => {

        let errorMessage = "";

    if (!selectedIds.name || !selectedIds.phoneNumber || !selectedIds.provinceId || !selectedIds.districtId || !selectedIds.wardId || !selectedIds.street) {
        errorMessage = "Vui lòng nhập đầy đủ thông tin";
    }

    else if (!validatePhoneNumber(selectedIds.phoneNumber)) {
        errorMessage = "Vui lòng nhập số điện thoại đúng định dạng";
    }

    if (errorMessage) {
        Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: errorMessage,
            text1Style: {
                fontSize: 16,
                fontFamily: "helvetica-neue-bold",
            },
            text2Style: {
                fontSize: 12,
                fontFamily: "helvetica-neue-bold",
                color: colors.text.black_50,
            },
        });
        return;
    }

        try {
            const docRef = await addDoc(collection(db, "addresses"), {
                name: selectedIds.name,
                phoneNumber: selectedIds.phoneNumber,
                provinceId: selectedIds.provinceId,
                districtId: selectedIds.districtId,
                wardId: selectedIds.wardId,
                provinceName: selectedIds.provinceName,
                districtName: selectedIds.districtName,
                wardName: selectedIds.wardName,
                street: selectedIds.street,
                userId: userData.id,
                isDefault: selectedIds.isDefault,
            });

            const addressId = docRef.id;

            await updateDoc(doc(collection(db, "addresses"), addressId), {
                addressId: addressId,
            });
            Toast.show({
                type: "success",
                text1: "Thành công",
                text2: "Đã lưu địa chỉ",
                text1Style: {
                    fontSize: 16,
                    fontFamily: "helvetica-neue-bold",
                },
                text2Style: {
                    fontSize: 12,
                    fontFamily: "helvetica-neue-bold",
                    color: colors.text.black_50,
                },
            });
            navigation.goBack();
        } catch (error) {
            console.log("Lỗi khi lưu địa chỉ:", error);
            Toast.show({
                type: "error",
                text1: "Lỗi",
                text2: "Đã xảy ra lỗi khi lưu địa chỉ",
                text1Style: {
                    fontSize: 16,
                    fontFamily: "helvetica-neue-bold",
                },
                text2Style: {
                    fontSize: 12,
                    fontFamily: "helvetica-neue-bold",
                    color: colors.text.black_50,
                },
            });
        }
    };

    const validatePhoneNumber = (phoneNumber) => {
        const phoneRegex = /^[0-9]{10}$/; 
        return phoneRegex.test(phoneNumber);
    };
    

    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View>{renderInputInfo()}</View>
                <CustomButton
                    text={"Xác nhận"}
                    onPress={handleSaveNewAddress}
                />
            </ScrollView>
        </View>
    );
};

const mapStateToProps = (state) => ({
    userData: state.auth.userData,
});

export default connect(mapStateToProps)(AddNewAddressScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: colors.background.white_100,
        padding: "5%",
    },
    mapContainer: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
        borderRadius: 10,
        padding: "10%",
        borderWidth: 1,
        borderColor: colors.background.black_20,
        overflow: "hidden",
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    button: {
        position: "absolute",
        top: "5%",
        right: "5%",
        padding: "2%",
        backgroundColor: colors.background.lightGrey_10,
        borderColor: colors.background.black_20,
        borderWidth: 1,
        borderRadius: 100,
    },
    buttonText: {
        color: "#fff",
        fontWeight: "bold",
    },
});