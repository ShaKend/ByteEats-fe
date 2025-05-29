import React from "react";
import { StyleSheet, TextInput, View, ViewStyle, TextStyle } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Color } from "../../styles/Color";

interface TextboxProps{
    styleTextbox?: ViewStyle;
    styleTextInput?: TextStyle;
    iconName?: string;
    placeholder: string;
    onChangeText?: (text: string) => void;
    keyboardType?: "default" | "numeric" | "email-address" | "phone-pad"; 
    maxLength?: number
    value?: string | number; // Optional prop for controlled input
    secureTextEntry?: boolean; // Optional prop for secure text entry
}

const Textbox: React.FC<TextboxProps> = ({
  styleTextbox,
  styleTextInput,
  iconName,
  placeholder,
  onChangeText,
  keyboardType = "default",
  maxLength,
  value,
  secureTextEntry = false, // Default to false if not provided
}) => {
  return (
    <View style={[styles.container, styleTextbox]}>
      {iconName && (
        <Icon name={iconName} size={20} color={Color.darkPurple} style={styles.icon} />
      )}
      <TextInput
        placeholder={placeholder}
        style={[styles.textInput, styleTextInput]}
        placeholderTextColor="gray"
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        value={value !== undefined ? String(value) : undefined} // Ensure value is always a string
        secureTextEntry={secureTextEntry} // Use secureTextEntry prop
      />
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Agar icon dan input sejajar
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Color.darkPurple,
        borderRadius: 10,
        width: 260,
        backgroundColor: 'transparent',
        paddingHorizontal: 10, // Beri padding biar lebih rapi
      },
      icon: {
        marginRight: 8, // Jarak antara ikon dan teks input
      },
      textInput: {
        flex: 1, // Biar input mengambil sisa ruang
      }
})

export default Textbox;
