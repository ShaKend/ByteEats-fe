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
import { updateProfileImage, getUserById } from "../../service/ApiServiceUser";

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
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  //const profileUrl = `${API}/profile-images/${user?.profilepicture}`;

  const profileUrl = localImageUri
    ? localImageUri
    : user?.profilepicture
      ? `${API}/profile-images/${user?.profilepicture}`
      : null;


  const handleEdit = async () => {
    if (isEditing) {
      try {
        if (user) {
          // If new image is selected (local file), upload it
          if (user.profilepicture && user.profilepicture.startsWith("file://")) {
            const formData = new FormData();
            formData.append("profilepicture", {
              uri: user.profilepicture,
              name: "profile.jpg",
              type: "image/jpeg",
            } as any);
          
            // Just upload, don't care about response filename
            await updateProfileImage(formData);
          }
        
          // Update other user details (assuming backend uses JWT to identify user)
          await updateUser(
            user.userid,
            user.username,
            user.password,
            user.gender ?? "",
            Number(user.age)
          );

            const response = (await getProfile()) as { data: User };
            setUser(response.data);
            setLocalImageUri(null);
        }
      } catch (err) {
        console.error("Error saving profile:", err);
      }
    }
  
    setIsEditing(!isEditing);
  };


  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setLocalImageUri(selectedImage.uri);
      setUser((prevUser) =>
        prevUser ? { ...prevUser, profilepicture: selectedImage.uri } : null
      );
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
          <TouchableOpacity onPress={isEditing ? handleSelectImage : undefined}>
            <Image
              source={profileUrl ? { uri: profileUrl } : require('../../assets/byte-eats-logo.png')}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
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
