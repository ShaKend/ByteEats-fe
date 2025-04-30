import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";

const searchIconSvg = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19.7558 18.5775L14.7818 13.6035C16.1371 11.9647 16.8037 9.91666 16.6675 7.84666C16.5313 5.77666 15.6014 3.83333 14.0548 2.37C12.5082 0.906666 10.4648 0.0266664 8.3548 0.000666382C6.24479 -0.0253336 4.17812 0.803333 2.59146 2.23333C1.00479 3.66333 0.0214574 5.58333 -0.165876 7.65C-0.35321 9.71666 0.213124 11.7833 1.48979 13.47C2.76646 15.1567 4.65146 16.3333 6.74479 16.77C8.83812 17.2067 11.0214 16.8733 12.8881 15.84L17.8948 20.8467C18.0814 21.0333 18.3281 21.1333 18.5881 21.1333C18.8481 21.1333 19.0948 21.0333 19.2814 20.8467L19.7558 20.3723C19.9425 20.1857 20.0425 19.939 20.0425 19.679C20.0425 19.419 19.9425 19.1723 19.7558 18.9857V18.5775Z" fill="black"/>
</svg>
`;

interface Props {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<Props> = ({ value, onChangeText, placeholder }) => {
  return (
    <View style={styles.container}>
      <SvgXml xml={searchIconSvg} width={20} height={20} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#666"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#5D2084",
    borderRadius: 12,
    height: 48,
    marginHorizontal: 20,
    paddingHorizontal: 12,
    marginTop: -20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#000",
  },
});

export default SearchInput;
