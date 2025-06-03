import React, { useState, useEffect } from "react";
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextInput, Button } from "react-native";
import { useRoute, useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Color } from "../../styles/Color";
import SignHeader from "../../components/login/SignHeader";
import SignButton from "../../components/login/SignButton";
import Textbox from "../../components/login/Textbox";
import DividerMedia from "../../components/login/DividerMedia";
import Footer from "../../components/login/Footer";

import { createUser, login } from "../../service/ApiServiceUser";

type RouteParams = {
    loginAction: string;
};

type RootStackParamList = {
    Home: undefined; // No parameters for Dashboard
    Sign: { loginAction: string }; // Parameters for the Sign page
};

type SignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Sign'>;

function Sign() {
    const route = useRoute();
    const loginAction = (route.params as RouteParams)?.loginAction || 'SignIn';
    const navigation = useNavigation<SignScreenNavigationProp>();

    const [action, setAction] = useState(loginAction);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleCreateUser = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            setErrorMessage("all the column must not be empty!");
            return;
        }

        const usernameRegex = /^[a-zA-Z]{3,25}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const passwordRegex = /^[a-zA-Z0-9]{5,20}$/;

        if (!usernameRegex.test(username)) {
            setErrorMessage("Username must be 3-25 letters without numbers or symbols!");
            return;
        }

        if (!emailRegex.test(email)) {
            setErrorMessage("Email must be valid!");
            return;
        }

        if (!passwordRegex.test(password)) {
            setErrorMessage("Password must be alphanumeric 5-20 characters!");
            return;
        }

        try {
            await createUser(email, "manual", username, password);
            await handleLogin();
            navigation.navigate('Home');
        } catch (err) {
            console.error("Error: " + err);
            setErrorMessage("Registrasi gagal. Silakan coba lagi.");
        }
    };


    const handleLogin = async () => {
        try {
            const response = await login(email, password);
            const token = (response as any).token;

            if (token) {
                await AsyncStorage.setItem('token', token);
                navigation.navigate('Home');
                console.log("Login success!");
            } else {
                console.error("Error: Token is undefined. Login failed.");
                alert("Login gagal. Token tidak tersedia.");
            }
        } catch (err) {
            console.error("Error: " + err);
            alert("Login gagal. Silakan periksa email dan password Anda.");
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

            {/* <SignHeader
                title={splitCamelCase(loginAction)}
                detail={detailText}
                styleHeader={styles.header}
            ></SignHeader> */}


            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    {splitCamelCase(loginAction)}
                </Text>
                <Text style={styles.headerDetail}>
                    {detailText}
                </Text>
            </View>


            <View style={styles.content}>


                {/* {loginAction == "SignIn" ? <View></View> :
                    <Textbox
                        placeholder="Username" 
                        iconName="person" 
                        styleTextbox={styles.firstTextbox}
                        // onChangeText={setUsername}
                    >
                    </Textbox>
                } */}


                {loginAction == "SignIn" ? <View></View> :
                    <View style={[styles.firstTextbox, styles.textInputContainer]}>
                        <Icon name={"person"} size={20} color={Color.darkPurple} style={styles.textInputicon} />
                        <TextInput
                            placeholder={"Username"}
                            placeholderTextColor="gray"
                            onChangeText={setUsername}
                            style={styles.textInput}
                        />
                    </View>
                }


                <View style={loginAction == "SignIn" ? [styles.firstTextbox, styles.textInputContainer] : [styles.secondTextbox, styles.textInputContainer]}>
                    <Icon name={"alternate-email"} size={20} color={Color.darkPurple} style={styles.textInputicon} />
                    <TextInput
                        placeholder={"Email"}
                        placeholderTextColor="gray"
                        onChangeText={setEmail}
                        style={styles.textInput}
                    />
                </View>
                <View style={[styles.pass, styles.textInputContainer]}>
                    <Icon name={"visibility"} size={20} color={Color.darkPurple} style={styles.textInputicon} />
                    <TextInput
                        placeholder={"Password"}
                        placeholderTextColor="gray"
                        onChangeText={setPassword}
                        style={styles.textInput}
                    />
                </View>

                <View style={{ minHeight: 20, width: 260, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
                    {errorMessage !== '' ? (
                        <Text style={styles.errorText}>{errorMessage}</Text>
                    ) : (
                        <Text style={[styles.errorText, { color: 'transparent' }]}>placeholder</Text>
                    )}
                </View>


                {/* <Textbox 
                    placeholder="Email" 
                    iconName="alternate-email" 
                    styleTextbox={loginAction == "SignIn" ? styles.firstTextbox : styles.secondTextbox} 
                    // onChangeText={setEmail}
                /> */}
                {/* <Textbox 
                    placeholder="Password" 
                    iconName="visibility" 
                    styleTextbox={styles.pass} 
                    // onChangeText={setPassword}    
                /> */}

                <SignButton
                    text="Continue"
                    styleButton={styles.btn}
                    styleText={styles.btnText}
                    authprovider="manual"
                    loginAction={loginAction}
                    onPress={() => { loginAction == 'SignUp' ? handleCreateUser() : handleLogin() }}
                />

                <DividerMedia></DividerMedia>

                {/* Ignore this component */}
                <SignButton
                    text="Continue with Google"
                    styleButton={styles.medsos}
                    styleText={styles.medsosText}
                    authprovider="google"
                    loginAction={action}
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
        marginTop: 40
    },
    secondTextbox: {
        marginTop: 20
    },
    pass: {
        marginTop: 20
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
});

export default Sign;
