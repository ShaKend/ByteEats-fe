import { View, Text, StyleSheet, ViewStyle, TextStyle } from "react-native";
import { Color } from "../../styles/Color";
import React from "react";

interface SignHeaderProps{
    styleHeader?: ViewStyle,
    styleTitle?: TextStyle,
    styleDetail?: TextStyle,
    title: string,
    detail: string
}

const SignHeader: React.FC<SignHeaderProps> = ({styleHeader, styleTitle, styleDetail, title, detail}) => {
    return(
        <View style={styleHeader}>
            <Text style={[styles.title, styleTitle]}>
                {title}
            </Text>
            <Text style={[styles.detail, styleDetail]}>
                {detail}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 32,
        fontWeight: 700,
        color: Color.darkPurple,
        textAlign: 'center'
    },
    detail: {
        textAlign: 'center',
        color: Color.darkPurple,
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
    }
})

export default SignHeader;
