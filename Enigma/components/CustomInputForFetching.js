import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import { colors } from "../assets/colors";
import RNPickerSelect from "react-native-picker-select";

const CustomInputForFetching = ({
    type = "",
    label = "",
    placeholder = "",
    Value = "",
    datalist = [],
    onValueChange = (value) => { }
}) => {
    const [inputValue, setInputValue] = useState(Value);
    const [value, setValue] = useState(Value);
    const [isFocus, setIsFocus] = useState(false);

    useEffect(() => {
        setInputValue(Value);
        setValue(Value);
    }, [Value]);

    const renderInputByType = () => {
        if (type === "dropdown") {
            return (
                <RNPickerSelect
                    style={pickerSelectStyles}
                    placeholder={{
                        label: !isFocus ? 'Chọn ' + label : '...',
                        value: null,
                        color: colors.text.grey_100,
                    }}
                    onValueChange={(itemValue) => {
                        setValue(itemValue);
                        setIsFocus(false);
                        onValueChange(itemValue);
                    }}
                    items={datalist}
                    value={value}
                />
            );
        } else {
            const keyboardType = label === "Số điện thoại" ? "numeric" : "default";

            return (
                <TextInput
                    placeholder={placeholder}
                    value={inputValue}
                    style={styles.input}
                    placeholderTextColor={colors.text.grey_100}
                    onChangeText={text => {
                        setInputValue(text);
                        onValueChange(text);
                    }}
                    keyboardType={keyboardType}
                />
            );
        }
    };

    return (
        <View style={styles.container}>
            <Text
                style={[
                    styles.label,
                    {
                        color: !inputValue
                            ? colors.text.black_100
                            : colors.text.black_50,
                    },
                ]}
            >
                {label}

            </Text>
            {renderInputByType()}
        </View>
    );
};

export default CustomInputForFetching;

const styles = StyleSheet.create({
    container: {
        borderColor: colors.background.black_20,
        borderWidth: 1,
        paddingVertical: "4%",
        paddingHorizontal: "6%",
        borderRadius: 8,
        backgroundColor: colors.background.white_100,
    },
    label: {
        fontSize: 12,
        fontFamily: "helvetica-neue-bold",
        textTransform: "uppercase",
        marginBottom: "1%",
    },
    input: {
        color: colors.text.black_100,
        fontSize: 16,
        fontFamily: "helvetica-neue-medium",
        lineHeight: 20,
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 4,
        color: colors.text.black_100,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: 'purple',
        borderRadius: 8,
        color: colors.text.black_100,
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
