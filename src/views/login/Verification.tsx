import React from "react";
import { StyleSheet, Image, SafeAreaView, View, Text } from "react-native";
import { Color } from "styles/Color";
import Textbox from "components/login/Textbox";


function Verification() {

    return (
        <SafeAreaView style={styles.container}>
            <Text>Verify you account</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightPurple,
        flex: 1,
    }
});
