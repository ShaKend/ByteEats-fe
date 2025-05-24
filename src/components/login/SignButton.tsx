import React from "react";
import { TouchableOpacity, View, Text, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { Color } from "../../styles/Color";

interface SignButtonProps{
    styleButton?: ViewStyle;
    styleText?: TextStyle;
    text: string;
    onPress?: () => void;
};

const SignButton: React.FC<SignButtonProps> = ({ styleButton, styleText, text, onPress }) => {
    return (
        <View style={[styles.content, styleButton]}>
            <TouchableOpacity
                onPress={onPress}
            >
                <Text style={[styles.text, styleText]}>
                    {text}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        backgroundColor: Color.white,
        padding: 10,
        borderRadius: 12
    },
    text: {
        textAlign: 'center'
    }
})

export default SignButton;
