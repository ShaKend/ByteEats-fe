// src/views/OnBoarding/OnBoardingB.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function OnBoardingB() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/taco.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Make Smarter Food Choices!</Text>
        <Text style={styles.subtitle}>
           Monitor your daily intake to achieve a healthier and more balanced lifestyle.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("Login" as never)}
      >
        <Text style={styles.nextButtonText}>Start</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/bg.png")}
        style={styles.waveBackground}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingBottom: 100,
    zIndex: 1,
    width: "100%",
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 10,
    marginTop: 30, 
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#5D3891",
    textAlign: "center",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  waveBackground: {
    position: "absolute",
    bottom: -360,
    width: "100%",
    height: "100%",
    zIndex: 0,
  },
  nextButton: {
    position: "absolute",
    bottom: 10,
    right: 30,
    backgroundColor: "#5D3891",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
    zIndex: 2,
  },
  nextButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
});
