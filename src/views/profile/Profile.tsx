import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from 'expo-linear-gradient';

import SignButton from "../../components/login/SignButton";
import { Color } from "../../styles/Color";
import { getProfile } from "../../service/ApiServiceUser";
import { API } from "../../service/ApiService"
import Textbox from "../../components/profile/Textbox";
import EditBtn from "../../components/profile/EditBtn";

type RootStackParamList = {
  Home: undefined;
  Sign: { loginAction: string };
};

type SignScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Sign"
>;

type User = {
  userid: string;
  username: string;
  email: string;
  gender?: string;
  age?: string;
  profilepicture?: string;
};

function Profile() {
  const navigation = useNavigation<SignScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const profileUrl = `${API}/profile-images/${user?.profilepicture}`;

  const handleEditing = () => {
    setIsEditing(!isEditing);
    console.log("editing: ", isEditing);
  }
  

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = (await getProfile()) as { data: User };
        setUser(response.data);
      } catch (err) {
        console.error("Error fetching user profile:", err);
      }
    };
    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("Sign", { loginAction: "SignIn" });
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  // console.log("age: ", user?.age);
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#BB7AE8', 'white']} style={styles.gradient} />

      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Image
            source={
              profileUrl
              ? { uri: profileUrl }
              : require('../../assets/byte-eats-logo.png')
            }
            style={styles.avatarImage}
          />
        </View>
        <Text style={styles.editText}>Edit foto</Text>
      </View>

        {/* // <View style={styles.profileInfo}>
        //   <InfoRow label="Name" value={user?.username} />
        //   <InfoRow label="Email" value={user?.email} />
        //   <InfoRow label="Gender" value={user?.gender == 'F' ? 'Female' : 'Male'} />
        //   <InfoRow label="Age" value={user?.age || '-'} />
        // </View> */}

        <View>
          <Textbox
            value={user?.username}
            onChange={(value) => setUser(user ? { ...user, username: value } : null)}
            isDisabled={isEditing}
            label="Name"
            styleTextbox={{marginTop: 40}}
          />
          <Textbox
            value={user?.email}
            onChange={(value) => setUser(user ? { ...user, email: value } : null)}
            isDisabled={isEditing}
            label="Email"
          />
          <Textbox
            value={user?.gender == 'F' ? 'Female' : 'Male'}
            onChange={(value) => setUser(user ? { ...user, gender: value } : null)}
            isDisabled={isEditing}
            label="Gender"
          />
          <Textbox
            value={user?.age?.toString() || '-'}
            onChange={(value) => setUser(user ? { ...user, age: value } : null)}
            isDisabled={isEditing}
            label="Age"
          />
        </View>

        <EditBtn
          onClick={() => handleEditing()}
        />

      <SignButton
        text="Sign Out"
        styleButton={styles.btn}
        styleText={styles.text}
        loginAction="SignIn"
        authprovider="sign"
        onPress={handleLogout}
      />
    </SafeAreaView>
  );
}

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  gradient: {
    position: "absolute",
    height: "50%",
    width: "100%",
    top: 0,
  },
  avatarContainer: {
    alignItems: "center",
    marginTop: 80,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarImage: {
    height: 90,
    width: 90,
    resizeMode: "contain",
  },
  editText: {
    marginTop: 8,
    color: "#6C4BA6",
    fontSize: 14,
  },

  // profile info
  profileInfo: {
    marginTop: 30,
    paddingHorizontal: 32,
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 4,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    color: "#555",
  },

  btn: {
    backgroundColor: "#C5172E",
    width: 240,
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: Color.white,
  },
});

export default Profile;
