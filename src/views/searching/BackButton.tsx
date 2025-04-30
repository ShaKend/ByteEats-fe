import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { SvgXml } from "react-native-svg";

const backArrowSvg = `
<svg width="33" height="8" viewBox="0 0 33 8" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.292893 4.70711C-0.0976311 4.31658 -0.0976311 3.68342 0.292893 3.29289L6.65685 -3.07107C7.04738 -3.46159 7.68054 -3.46159 8.07107 -3.07107C8.46159 -2.68054 8.46159 -2.04738 8.07107 -1.65685L2.41421 4L8.07107 9.65685C8.46159 10.0474 8.46159 10.6805 8.07107 11.0711C7.68054 11.4616 7.04738 11.4616 6.65685 11.0711L0.292893 4.70711ZM33 5V4V3H1V4V5H33Z" fill="black"/>
</svg>
`;

interface BackButtonProps {
  onPress: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.circle}>
        <SvgXml xml={backArrowSvg} width={33} height={8} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { padding: 8 },
  circle: {
    width: 39,
    height: 39,
    borderRadius: 19.5,
    borderWidth: 1,
    borderColor: "#5D2084",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default BackButton;
