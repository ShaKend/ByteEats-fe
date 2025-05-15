import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import axios from 'axios'; // Assuming you're using axios for requests

import SignButton from "../../components/login/SignButton";
import { updateUser } from "../../service/ApiServiceUser";
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
  password?: string;
};

function Profile() {
  const navigation = useNavigation<SignScreenNavigationProp>();
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const profileUrl = `${API}/profile-images/${user?.profilepicture}`;

  const handleEdit = async () => {
    if (isEditing) {
      try {
        if (user) {
          let updatedProfilePicture = user.profilepicture;

          // If the user picked a new image
          if (user.profilepicture && user.profilepicture.startsWith("file://")) {
            const formData = new FormData();
            formData.append("profileImage", {
              uri: user.profilepicture,
              name: "profile.jpg",
              type: "image/jpeg",
            } as any); // Cast to 'any' to satisfy React Native FormData typing

            const uploadResponse = await axios.post(`${API}/upload-profile-image`, formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            updatedProfilePicture = (uploadResponse.data as { filename: string }).filename;
          }

          // Then update user details
          const updateResponse = await updateUser(
            user.userid,
            user.username,
            user.password,
            updatedProfilePicture,
            user.gender,
            Number(user.age)
          );

          if (updateResponse && typeof updateResponse === 'object' && 'data' in updateResponse) {
            setUser(updateResponse.data as User);
          }
        }
      } catch (err) {
        console.error("Error saving profile:", err);
      }
    }

    setIsEditing(!isEditing);
  };

  const handleImagePicker = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUser(user ? { ...user, profilepicture: result.assets[0].uri } : null);
    }
  };



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

      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Sign', params: { loginAction: 'SignIn' } }], // Or your login screen name
        })
      );
    } catch (err) {
      console.error("Logout error:", err);
    }
  };
  //console.log("User pass: ", user?.password);
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

        <View style={{marginTop: 40}}>
          <Textbox
            value={user?.email}
            onChange={(value) => setUser(user ? { ...user, email: value } : null)}
            isDisabled={false}
            label="Email"
          />
          <Textbox
            value={user?.username}
            onChange={(value) => setUser(user ? { ...user, username: value } : null)}
            isDisabled={isEditing}
            label="Name"
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
          {!isEditing ? "" : 
            <Textbox
              value={""}
              onChange={(value) => setUser(user ? { ...user, password: value } : null)}
              isDisabled={isEditing}
              label="Password"
            />
          }
        </View>

        <EditBtn
          onClick={() => handleEdit()}
          text={isEditing ? "Save" : "Edit Profile"}
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
