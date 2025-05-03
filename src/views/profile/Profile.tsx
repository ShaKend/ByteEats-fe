import { View, SafeAreaView, Text, StyleSheet } from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect } from "react";

import SignButton from "../../components/login/SignButton";
import { Color } from "../../styles/Color";
import { getProfile } from "../../service/ApiServiceUser";

type RootStackParamList = {
  Home: undefined; // No parameters for Dashboard
  Sign: { loginAction: string }; // Parameters for the Sign page
};

type SignScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Sign"
>;

type User = {
  userid: string;
  username: string;
  email: string;
  profilepicture?: string;
};

function Profile() {
  const navigation = useNavigation<SignScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = (await getProfile()) as { data: User };
        setUser(response.data);
        //console.log("User profile:", response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

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
      <Text>Welcome {user?.username}</Text>

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
