import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, StyleSheet, TextInput, ActivityIndicator } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Color } from "../../styles/Color";
import SignButton from "../../components/login/SignButton";
import Textbox from "../../components/login/Textbox";
import DividerMedia from "../../components/login/DividerMedia";
import Footer from "../../components/login/Footer";

import { verifyEmail, login, getUserByEmail } from "../../service/ApiServiceUser";

type RouteParams = {
    loginAction: string;
};

type RootStackParamList = {
    Home: undefined;
    Sign: { loginAction: string };
    Verification: {
        email: string;
        username?: string;
        password: string;};
};

type User = {
    email: string;
    password: string;
    username?: string;
};

function Sign() {
    const route = useRoute();
    const loginAction = (route.params as RouteParams)?.loginAction || 'SignIn';
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList, 'Sign'>>();

    const [action, setAction] = useState(loginAction);
    const [user, setUser] = useState<User>({ email: '', username: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState<{ email?: string; username?: string; password?: string }>({});

    const inputValidation = () => {
        const errors: { email?: string; username?: string; password?: string } = {};
        
        // Username validation (only for SignUp)
        if (action === "SignUp") {
            if (!user.username || user.username.trim() === "") {
                errors.username = "Username is required.";
            } else if (user.username.length < 2) {
                errors.username = "Username must be at least 2 characters.";
            }
        }

        // Email validation
        if (!user.email || user.email.trim() === "") {
            errors.email = "Email is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(user.email)) {
                errors.email = "Please enter a valid email address.";
            }
        }

        // Password validation
        if (!user.password || user.password.trim() === "") {
            errors.password = "Password is required.";
        } else if (user.password.length < 5) {
            errors.password = "Password must be at least 5 characters.";
        }

        return errors;
    };

    const isEmailExists = async () => {
        try {
            const response = await getUserByEmail(user?.email);
            if (response && Object.keys(response).length > 0) {
                return "Email already exists.";
            }
            return false;
        } catch (error: any) {
            // If backend returns 404, treat as 'email does not exist' (OK for registration)
            if (error.response && error.response.status === 404) {
                return false;
            }
            console.error("Error checking email existence:", error);
            return false;
        }
    };

    const handleCreateUser = async () => {
        setLoading(true);
        const errors = inputValidation();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return;
        }
        // Only check for email existence if no other errors
        const emailExists = await isEmailExists();
        if (emailExists) {
            setFormErrors({ email: emailExists as string });
            setLoading(false);
            return;
        }
        try {
            await verifyEmail(user?.email);
            navigation.navigate('Verification', {
                email: user.email,
                username: user.username,
                password: user.password,
            });
        } catch (err) {
            console.error("Error: " + err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        const errors = inputValidation();
        setFormErrors(errors);
        if (Object.keys(errors).length > 0) {
            setLoading(false);
            return;
        }
        try {
            const response = await login(user?.email, user?.password);
            const token = (response as any).token;
            if (token) {
                await AsyncStorage.setItem('token', token);
                navigation.navigate('Home');
            } else {
                console.error("Error: Token is undefined. Login failed.");
                alert("Login gagal. Token tidak tersedia.");
            }
        } catch (err) {
            console.error("Error: " + err);
        } finally {
            setLoading(false);
        }
    };

    const splitCamelCase = (str: string) => {
        return str.replace(/([a-z])([A-Z])/g, '$1 $2');
    };

    useEffect(() => {
        if (loginAction) {
            setAction((route.params as RouteParams)?.loginAction);
        }
    }, [loginAction]);


    // Tambahkan ini:
    useEffect(() => {
        setUsername('');
        setEmail('');
        setPassword('');
        setErrorMessage('');
    }, [action]);

    useEffect(() => {
        if (username.trim() && email.trim() && password.trim()) {
            if (errorMessage === "all the column must not be empty!") {
                setErrorMessage('');
            }
        }
    }, [username, email, password]);
    const detailText = loginAction === 'SignIn'
        ? "Hello, good to see you again!"
        : "Start your health journey today! Track your calories intake and stay on top of your wellness";

    return (
        <SafeAreaView style={styles.container}>
            {loading && (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color={Color.darkPurple} />
                </View>
            )}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {splitCamelCase(loginAction)}
                </Text>
                <Text style={styles.headerDetail}>
                    {detailText}
                </Text>
            </View>

            <View style={styles.content}>
                {loginAction == "SignIn" ? <View></View> :
                    <View style={[styles.firstTextbox, styles.textInputContainer]}>
                        <Icon name={"person"} size={20} color={Color.darkPurple} style={styles.textInputicon} />
                        <TextInput
                        placeholder={"Username"}
                        placeholderTextColor="gray"
                        style={styles.textInput}
                        onChangeText={(value) => {setUser({ ...user, username: value })}}
                        />
                    </View>
                }
                {formErrors.username && (
                    <Text style={styles.errorText}>{formErrors.username}</Text>
                )}

                <Textbox
                    placeholder="Email"
                    iconName="alternate-email"
                    styleTextbox={loginAction == "SignIn" ? styles.firstTextbox : styles.secondTextbox}
                    onChangeText={(value) => {setUser({ ...user, email: value })}}
                />
                {formErrors.email && (
                    <Text style={styles.errorText}>{formErrors.email}</Text>
                )}

                <Textbox
                    placeholder="Password"
                    iconName="visibility"
                    styleTextbox={styles.pass}
                    onChangeText={(value) => {setUser({ ...user, password: value })}}
                />
                {formErrors.password && (
                    <Text style={styles.errorText}>{formErrors.password}</Text>
                )}
                { loginAction === 'SignIn' &&
                    <Text style={styles.forgotPassword}>
                        Forgot Password?
                    </Text>
                }


                <SignButton
                    text="Continue"
                    styleButton={styles.btn}
                    styleText={styles.btnText}
                    onPress={loginAction === 'SignUp' ? handleCreateUser : handleLogin}
                />

                <DividerMedia></DividerMedia>

                {/* Ignore this component */}
                <SignButton 
                    text="Continue with Google" 
                    styleButton={styles.medsos} 
                    styleText={styles.medsosText} 
                />
            </View>

            <Footer loginAction={action}></Footer>

        </SafeAreaView>
    );

}

const styles = StyleSheet.create({
    // whole page
    container: {
        backgroundColor: Color.lightPurple,
        flex: 1,
        alignItems: 'center',
    },

    errorText: {
        color: 'red',
        marginTop: 8,
        marginBottom: 4,
        textAlign: 'center',
        paddingHorizontal: 20,
        fontSize: 14,
    },

    //header
    header: {
        marginTop: 90,
        justifyContent: 'center'
    },
    headerTitle: {
        fontSize: 32,
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

    // textInput
    textInputContainer: {
        flexDirection: 'row', // Agar icon dan input sejajar
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Color.darkPurple,
        borderRadius: 10,
        width: 260,
        backgroundColor: 'transparent',
        paddingHorizontal: 10, // Beri padding biar lebih rapi
    },
    textInputicon: {
        marginRight: 8, // Jarak antara ikon dan teks input
    },
    textInput: {
        flex: 1, // Biar input mengambil sisa ruang
    },

    content: {
        marginTop: 20,
    },
    firstTextbox: {
        marginTop: 20
    },
    secondTextbox: {
        marginTop: 25
    },
    pass: {
        marginTop: 25
    },
    btn: {
        backgroundColor: Color.darkPurple,
        marginTop: 20,
    },
    btnText: {
        fontSize: 20,
        fontWeight: 700,
        color: Color.white
    },
    medsos: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        marginTop: 30,
    },
    medsosText: {
        color: Color.darkPurple,
        fontSize: 16,
        fontWeight: 700,
    },

    //validation error
    errorText: {
        color: Color.error,
        marginLeft: 5,
    },

    //forgot password
    forgotPassword: {
        color: Color.darkPurple,
        fontSize: 14,
        textAlign: 'right',
        textDecorationLine: 'underline',
    },

    //footer
    footerContent: {
        position: 'relative',
        bottom: 0,
        paddingBottom: 30
    },
    footerText: {
        color: Color.darkPurple,
        fontSize: 14,
        textAlign: 'center'
    },
    footerLink: {
        color: "blue", // Warna khusus untuk "Sign Up" atau "Sign In"
        fontSize: 14,
        fontWeight: "bold",
        textAlign: 'center'
    },

    //loading
    loading: {
        position: 'absolute', 
        top: 0, 
        left: 0, 
        right: 0, 
        bottom: 0, 
        backgroundColor: 'rgba(255,255,255,0.5)', 
        justifyContent: 'center', 
        alignItems: 'center', 
        zIndex: 10
    }
});

export default Sign;
