import React, { useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text, TouchableOpacity } from "react-native";
import { Color } from "styles/Color";
import Textbox from "components/login/Textbox";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";
import { createUser, login, getUserByEmail, changePassword, sendCodeToEmail, verifyCode } from "service/ApiServiceUser";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from "navigations/RootStackParamList";

// action (all these actions are done in the same page)
// forgot: in verification page, ask for user email, then send a verification code to reset password
// change: profile page send data to verification page, then send a verification code to change password
// register: sign page send data to verification page, then send a verification code to register user
type VerifyParams = {
    email: string;
    username: string;
    password: string;
    action: 'forgot' | 'change' | 'register'; 
};

function Verification() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute();
    const { email, username, password, action } = route.params as VerifyParams;
    const [verificationCode, setVerificationCode] = useState('');
    const [isEnterEmail, setIsEnterEmail] = useState(true);
    const [emailToReset, setEmailToReset] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isResetting, setIsResetting] = useState(false);
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        setVerificationCode('');
        setEmailToReset('');
    }, []);

    const handleRegister = async () => {
        setError(null);
        try {
            await createUser(email, "manual", password, verificationCode, username);
            // After successful registration, log the user in
            const response = await login(email, password);
            const token = (response as any).token;
            if (token) {
                await AsyncStorage.setItem('token', token);
                navigation.navigate('Home');
            } else {
                setError("Error: Token is undefined. Login after registration failed.");
            }
        } catch (err) {
            setError("Error creating user or logging in.");
            console.error("Error creating user or logging in:", err);
        }
    };

    const handleForgotPw = async () => {
        setError(null);
        if (isEnterEmail) {
            // If we are in the forgot password flow and the user has entered their email
            setIsEnterEmail(false);
                        
            const response = await sendCodeToEmail(emailToReset);
            // if ((response as any).status !== 200) {
            //     setError("Failed to send verification code. Please try again.");
            //     console.error("Error code:", (response as any).status);
            //     return;
            // }

            const user = await getUserByEmail(emailToReset);
            if (!user) {
                setError("Email does not exist.");
                return;
            }
            return;
        }
        // Step 1: Check if email exists
        try {
            // Step 2: Verify the code
            const isCodeValid = await verifyCode(emailToReset, verificationCode);
            if (!isCodeValid) {
                setError("Invalid verification code. Please try again.");
                return;
            }

            // Step 3: Call changePassword with email, code, and new password
            // await changePassword(emailToReset, verificationCode, password);
            // setError(null);
            // navigation.navigate('Sign', { loginAction: 'SignIn' });
            setIsResetting(true);
        } catch (err: any) {
            if (err.response && err.response.status === 404) {
                setError("Email does not exist.");
            } else {
                setError("Failed to reset password. Please check your code and try again.");
            }
            console.error("Error in forgot password flow:", err);
        }
    };

    const handleChangePw = async () => {
        setError(null);
        try {
            // await changePassword(email, verificationCode, password);
            // setError(null);
            // navigation.navigate('Sign', { loginAction: 'SignIn' });
            const isCodeValid = await verifyCode(emailToReset, verificationCode);
            if (!isCodeValid) {
                setError("Invalid verification code. Please try again.");
                return;
            }
            setIsResetting(true);
        } catch (err) {
            setError("Failed to change password. Please check your code and try again.");
            console.error("Error changing password:", err);
        }
    };

    const handleAction = async () => {
        if (action === 'register') {
            await handleRegister();
        } else if (action === 'forgot') {
            await handleForgotPw();
        } else if (action === 'change') {
            await handleChangePw();
        }
    };

    const headerTitle = action == 'forgot' ? "Reset Password" :
        action == 'change' ? "Change Password" : "Register Account";

    const headerDetail = () => {
        if (isResetting) {
            return "Please enter your new password.";
        }
        if (action === 'forgot') {
            return isEnterEmail ? "Please enter your email to receive a verification code." :
                "Please enter the verification code sent to your email.";
        } else if (action === 'change') {
            return "Please enter the verification code sent to your email to change your password.";
        } else if (action === 'register') {
            return "Please enter the verification code sent to your email to complete registration.";
        }
        return "";
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.headerTitle}> {headerTitle} </Text>
                <Text style={styles.headerDetail}> {headerDetail()} </Text>
                {error && (
                    <Text style={{ color: 'red', marginTop: 10 }}>{error}</Text>
                )}
                {isResetting ? (
                    <View>
                        <Textbox
                            placeholder="Enter your new password"
                            styleTextbox={{ marginTop: 20, width: 210 }}
                            onChangeText={(text) => setNewPassword(text)}
                            iconName="visibility"
                            // secureTextEntry={true}
                        />
                        <Textbox
                            placeholder="Re-enter your new password"
                            styleTextbox={{ marginTop: 20, width: 210 }}
                            onChangeText={(text) => setNewPassword(text)}
                            iconName="visibility"
                            // secureTextEntry={true}
                        />
                    </View>
                ) : (
                    <View style={{ display: 'flex', flexDirection:'row' }}>
                        {action === 'forgot' && isEnterEmail ? (
                            <Textbox
                                placeholder="Enter your email"
                                styleTextbox={{ marginTop: 20, width: 210 }}
                                onChangeText={(text) => setEmailToReset(text)}
                                keyboardType="email-address"
                            />
                        ) : (
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
                                value={verificationCode}
                            />
                        )}
                        <TouchableOpacity
                            style={styles.confirmBtn}
                            onPress={() => handleAction()}
                        >
                            <Icon name="check" size={24} color={Color.white} />
                        </TouchableOpacity>
                    </View> 
                )}
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