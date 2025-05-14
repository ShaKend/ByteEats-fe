import React from 'react';
import { StyleSheet, TextInput, View, ViewStyle, TextStyle, Text } from 'react-native';

interface TextboxProps {
    value?: string; // Add the value prop
    isDisabled: boolean; 
    label: string;
    styleTextbox?: ViewStyle;
    onChange?: (text: string) => void; // Add the onChange prop
}

const Textbox: React.FC<TextboxProps> = ({
    styleTextbox,
    value,
    onChange, 
    isDisabled,
    label
}) => {
    return (
        <View style={[styles.container, styleTextbox]}>
            <View>
                <Text style={styles.text}>{label}</Text>
            </View>
            <TextInput
                style={[styles.textInput, { opacity: isDisabled ? 0.5 : 1 }]}
                value={value} // Bind the value prop
                onChangeText={onChange} // Use the onChange prop
                editable={isDisabled} // Disable the TextInput if isDisabled is true
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
        // borderColor: 'gray',
        // borderWidth: 0.5,
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        width: 70,
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