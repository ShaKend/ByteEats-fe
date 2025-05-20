import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";

const backArrowSvg = `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 18L9 12L15 6" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.circle}>
        <SvgXml xml={backArrowSvg} width={32} height={32} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8 },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BB94D5",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackButton;
