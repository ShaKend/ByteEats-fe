// src/views/OnBoarding/OnBoardingA.tsx
import React, {useEffect} from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from "navigations/RootStackParamList";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnBoardingA() {
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

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Image
          source={require("../../assets/pizza.png")}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Scan, Track, Stay Healthy!</Text>
        <Text style={styles.subtitle}>
           Simply scan your food and get instant calorie and nutrition details!
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate("OnBoardingB" as never)}
      >
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <Image
        source={require("../../assets/bg2.png")}
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
