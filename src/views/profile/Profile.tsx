import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import SignButton from "../../components/login/SignButton";
import { Color } from "../../styles/Color";

type RootStackParamList = {
  Home: undefined; // No parameters for Dashboard
  Sign: { loginAction: string }; // Parameters for the Sign page
};

type SignScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Sign"
>;

function Profile() {
  const navigation = useNavigation<SignScreenNavigationProp>();

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("Sign", { loginAction: "SignIn" }); // navigate to login screen
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <Text>This is profile page!</Text>

      <SignButton
        text="Sign Out"
        styleButton={styles.btn}
        styleText={styles.text}
        loginAction="SignIn"
        authprovider="sign"
        onPress={() => handleLogout()}
      ></SignButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    flex: 1,
  },
  btn: {
    backgroundColor: "#C5172E",
    width: 240,
    position: "absolute",
    bottom: 20, // Push the button 20 units from the bottom
    alignSelf: "center", // Centers it horizontally
  },
  text: {
    fontSize: 20,
    fontWeight: 700,
    textShadowColor: "black",
    color: Color.white,
  },
});

export default Profile;
