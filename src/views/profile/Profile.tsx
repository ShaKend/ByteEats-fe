import { View, SafeAreaView, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LinearGradient } from 'expo-linear-gradient';
import { CommonActions } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';

import SignButton from "../../components/login/SignButton";
import { updateUser } from "../../service/ApiServiceUser";
import { Color } from "../../styles/Color";
import { getProfile } from "../../service/ApiServiceUser";
import { API } from "../../service/ApiService"
import Textbox from "../../components/profile/Textbox";
import EditBtn from "../../components/profile/EditBtn";
import { updateProfileImage, sendCodeToEmail } from "../../service/ApiServiceUser";
import { RootStackParamList } from "navigations/RootStackParamList";
import { useUser } from "../../context/UserContext";

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
  const { user, setUser, refreshUser } = useUser();
  const [localImageUri, setLocalImageUri] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
          if (user.profilepicture && user.profilepicture.startsWith("file:///")) {
            const formData = new FormData();
            formData.append("profilepicture", {
              uri: user.profilepicture,
              name: "profile.jpg",
              type: "image/jpeg",
            } as any);
          
            // Just upload, don't care about response filename
              const uploadResponse = await updateProfileImage(formData);
              console.log("Upload response:", uploadResponse);
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
          await refreshUser();
          setLocalImageUri(null);          
        }
      } catch (err: any) {
        //console.error("Error saving profile:", err);
        const backendMsg = err.response?.data?.message || err.message || "Unknown error";
        console.log(backendMsg);
        throw new Error(backendMsg);
      }
    }
  
    setIsEditing(!isEditing);
  };

  const handleChangePw = async () => {
    if (user) {
      setIsLoading(true);
      try {
        // Send code to user's email for verification
        await sendCodeToEmail(user.email);
        // Navigate to verification screen with user details
        navigation.navigate('Verification', { 
          email: user.email, 
          username: user.username, 
          password: user.password || '', 
          action: 'change' 
        });
      } catch (err) {
        console.error("Error sending code to email:", err);
      } finally {
        setIsLoading(false);
      }
    }
  }

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const selectedImage = result.assets[0];
      setLocalImageUri(selectedImage.uri);
      if (user) {
        setUser({ ...user, profilepicture: selectedImage.uri });
      }
    }
  };
  
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

  useFocusEffect(
    React.useCallback(() => {
      // When the screen is focused, do nothing special
      return () => {
        // When the screen is unfocused (navigated away), reset isEditing
        setIsEditing(false);
      };
    }, [])
  );
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
        <View style={{marginTop: 20}}>
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
            value={user?.age?.toString()}
            onChange={(value) => setUser(user ? { ...user, age: value } : null)}
            isDisabled={isEditing}
            label="Age"
            maxLength={3}
            keyboardType="numeric"
          />
          <View style={styles.ddContainer}>
            <Text style={styles.ddText}>Gender</Text>
            <View
              style={styles.dropdown}>
              <Picker
                style={{ paddingLeft:0, marginLeft:0 }}
                selectedValue={user?.gender ?? ''}
                onValueChange={(itemValue) => {
                  if (isEditing && user) {
                    setUser({ ...user, gender: itemValue });
                  }
                }}
                enabled={isEditing}
              >
                <Picker.Item label="Select Gender" value="" />
                <Picker.Item label="Male" value="M" />
                <Picker.Item label="Female" value="F" />
              </Picker>
            </View>
          </View>
        <EditBtn
          onClick={() => handleEdit()}
          text={isEditing ? "Save" : "Edit Profile"}
        />

        <TouchableOpacity 
          onPress={() => handleChangePw()}
          style={styles.resetPassword}
          disabled={isLoading}
        >
          <Text style={{color: Color.darkPurple, textDecorationLine: 'underline'}}>
            Reset Password
          </Text>
        </TouchableOpacity>
        {isLoading && (
          <ActivityIndicator size="large" color={Color.darkPurple} style={{ marginTop: 20 }} />
        )}
        </View>


      <SignButton
        text="Sign Out"
        styleButton={styles.btn}
        styleText={styles.text}
        onPress={handleLogout}
      />

    </SafeAreaView>
  );
}

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
    marginTop: 50,
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

  // dropdown
  ddContainer: {
    paddingHorizontal: 40,
    marginVertical: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  ddText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    width: 80,
    paddingTop: 14,
  },
  dropdown: {
    borderBottomWidth: 0.5,
    marginLeft: 10,
    width: 200,
  },

  // sign out button
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

  // reset password
  resetPassword: {
    marginTop: 10,
    display: 'flex',
    alignItems: 'flex-end',
    marginRight: 40,
  }
});

export default Profile;
