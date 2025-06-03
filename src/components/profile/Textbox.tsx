import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle, TextStyle, Text } from 'react-native';

interface TextboxProps {
    value?: string; // Add the value prop
    isDisabled: boolean; 
    label: string;
    styleTextbox?: ViewStyle;
    onChange?: (text: string) => void; // Add the onChange prop
    maxLength?: number; // Optional prop for max length
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad"; // Optional prop for keyboard type
}

const Textbox: React.FC<TextboxProps> = ({
    styleTextbox,
    value,
    onChange, 
    isDisabled,
    label,
    maxLength,
    keyboardType = "default", 
}) => {
    return (
        <View style={[styles.container, styleTextbox]}>
            <View>
                <Text style={styles.text}>{label}</Text>
            </View>
            <TextInput
                style={[styles.textInput, { opacity: isDisabled ? 1 : 0.5 }]}
                value={value} 
                onChangeText={onChange} 
                editable={isDisabled} 
                maxLength={maxLength}
                keyboardType={keyboardType}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 40,
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        width: 80,
    },
    textInput: {
        paddingVertical: 0,
        marginLeft: 10,
        borderColor: 'gray',
        borderBottomWidth: 0.5,
        width: 200,
        // borderWidth: 1,
    },
});

export default Textbox;