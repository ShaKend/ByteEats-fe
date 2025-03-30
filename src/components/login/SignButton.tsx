import React from "react";
import { TouchableOpacity, View, Text, ViewStyle, TextStyle, StyleSheet } from "react-native";
import { Color } from "../../styles/Color";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, useCardAnimation } from '@react-navigation/stack';

type RootStackParamList = {
    Sign?: { loginAction: string };
    Dashboard?: undefined;
};

type NavigationProps = StackNavigationProp<RootStackParamList, 'Sign'>;

interface SignButtonProps{
    styleButton?: ViewStyle;
    styleText?: TextStyle;
    text: string;
    loginAction?: string;
    authprovider?: string | 'sign';
    onPress?: () => void;
};

const SignButton: React.FC<SignButtonProps> = ({ styleButton, styleText, text, loginAction, authprovider, onPress }) => {
    const navigation = useNavigation<NavigationProps>(); // Correct type

    const handlePress = () => {

        if(authprovider == 'sign') navigation.navigate('Sign', { loginAction: loginAction || 'SignIn' })
            if (onPress) {
                onPress();  // Panggil fungsi onPress dari parent
            }
    }
    
    return (
        <View style={[styles.content, styleButton]}>
            <TouchableOpacity
                onPress={handlePress}
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
