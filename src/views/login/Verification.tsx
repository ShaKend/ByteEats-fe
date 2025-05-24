import React from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Color } from "styles/Color";
import Textbox from "components/login/Textbox";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";


type RootStackParamList = {
    Home: undefined;
};

function Verification() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [verificationCode, setVerificationCode] = useState('');

    const handleVerificationCodeChange = () => {
        console.log("code: " + verificationCode);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerTitle}>Verify Your Account</Text>
                <Text style={styles.headerDetail}>
                    We have sent a verification code to your email.
                </Text>
                <View style={{ display: 'flex', flexDirection:'row' }}>
                    <Textbox
                        placeholder="Enter your verification code"
                        styleTextbox={{ marginTop: 20, width: 210 }}
                        onChangeText={(text) => {
                            // Only allow numbers and max 6 digits
                            const numericText = text.replace(/[^0-9]/g, '').slice(0, 6);
                            setVerificationCode(numericText);
                        }}
                        keyboardType="numeric"
                        maxLength={6}
                    />
                    <TouchableOpacity
                        style={styles.confirmBtn}
                        onPress={() => handleVerificationCodeChange()}
                    >
                        <Icon name="check" size={24} color={Color.white} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightPurple,
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        marginTop: 90,
        fontSize: 28,
        fontWeight: 700,
        color: Color.darkPurple,
        textAlign: 'center'
    },
    headerDetail: {
        textAlign: 'center',
        color: Color.darkPurple,
        marginTop: 20,
        paddingLeft: 30,
        paddingRight: 30,
    },
    confirmBtn: {
        marginTop: 20, 
        backgroundColor: Color.darkPurple, 
        padding: 10, 
        borderRadius: 8,
        marginLeft: 5
    },
});

export default Verification;