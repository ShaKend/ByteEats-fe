import React from "react";
import { Color } from "../../styles/Color";
import { StyleSheet, Image, SafeAreaView, View } from "react-native";
import SignButton from "../../components/login/SignButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
    Home: undefined;
    Sign: { loginAction: string };
    Verification: undefined;
};

// type SignScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

function Login(){
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    useEffect(() => {
        const checkAuth = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                navigation.navigate('Home');
            } 
        };
        checkAuth();
    }, []);


    return(
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>
                <Image source={require('../../assets/byte-eats-logo.png')} style={styles.img}></Image>
                <View>
                    <SignButton
                        text="Sign Up"
                        styleButton={styles.signUp}
                        styleText={styles.btnTextSignUp}
                        onPress={() => navigation.navigate('Sign', { loginAction: 'SignUp' })}
                        // onPress={() => navigation.navigate("Verification")}
                    />
                    <SignButton
                        text="Sign in"
                        styleButton={styles.signIn}
                        styleText={styles.btnTextSignIn}
                        onPress={() => navigation.navigate('Sign', { loginAction: 'SignIn' })}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Color.lightPurple,
        flex: 1,
    },
    content: {
        alignItems: 'center',
        marginTop: 160,
    },
    login: {
        paddingLeft: 20,
        paddingRight: 20,
        marginTop: 90,
        height: 900,
        backgroundColor: 'transparent'
    },
    img: {
        width: 300,
        height: 300
    },  
    signUp: {
        backgroundColor: Color.darkPurple,
        color: Color.white,
        width: 240,
        textShadowColor: 'black',
        fontSize: 20,
        fontWeight: 700,
    },
    signIn: {
        backgroundColor: 'transparent',
        borderWidth: 1.4,
        borderColor: Color.darkPurple,
        marginTop: 18,
        fontSize: 20,
        fontWeight: 700,
    },
    btnTextSignIn: {
        fontSize: 20,
        fontWeight: 700,
        color: Color.darkPurple,
    },
    btnTextSignUp: {
        fontSize: 20,
        fontWeight: 700,
        color: Color.white,
    }
})

export default Login;