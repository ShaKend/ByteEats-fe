import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { Color } from "../../styles/Color";
import React from "react";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { DefaultTransition } from "@react-navigation/stack/lib/typescript/commonjs/src/TransitionConfigs/TransitionPresets";

type RootStackParamList = {
    Sign: { loginAction: string }; // Single screen named 'Sign' with the 'loginAction' param
};

interface FooterProps {
    styleFooter?: ViewStyle;
    loginAction: string;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const Footer: React.FC<FooterProps> = ({ styleFooter, loginAction }) => {
    const navigation = useNavigation<NavigationProp>();

    return (
        <View style={[styles.content, styleFooter]}>
            {loginAction === "SignIn" ? (
                <View>
                    <Text style={styles.text}>Forgot Password?</Text>
                    <Text style={styles.text}>Are you a new User?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Sign', { loginAction: 'SignUp' })}>
                        <Text style={styles.link}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View>
                    <Text style={styles.text}>Already have an account?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Sign', { loginAction: 'SignIn' })}>
                        <Text style={styles.link}>Sign In</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        position: 'relative',
        bottom: 0,
        paddingBottom: 30
    },
    text: {
        color: Color.darkPurple,
        fontSize: 14,
        textAlign: 'center'
    },
    link: {
        color: "blue", // Warna khusus untuk "Sign Up" atau "Sign In"
        fontSize: 14,
        fontWeight: "bold",
        textAlign: 'center'
    },
});


export default Footer;