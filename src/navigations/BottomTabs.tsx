import React, { useState } from "react";
import { TouchableOpacity, Text, View, ActivityIndicator } from "react-native";
import { createBottomTabNavigator, BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";
import * as ImagePicker from 'expo-image-picker';
import { Alert } from "react-native";

import Home from "../views/home/Home";
import Favorite from "../views/favorite/Favorite";
import History from "../views/history/History";
import Profile from "../views/profile/Profile";
import { uploadFoodImage } from "service/ApiServiceFoodScan";
import { useNavigation } from '@react-navigation/native';

import { Color } from "../styles/Color";

const Tab = createBottomTabNavigator();

type FoodInfo = {
  label: string
  caloriesPer100g: string | number
}

const DummyScreen = () => null;

export type RootStackParamList = {
  BottomTabs: undefined;
  ScanFood: undefined;
};

export default function BottomTabs() {
  const [isUploading, setIsUploading] = React.useState(false);


  const handleScan = async () => {
    Alert.alert(
      "Upload Food Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              alert('Camera permission is required!');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const selectedImage = result.assets[0];
              const formData = new FormData();
              formData.append('image', {
                uri: selectedImage.uri,
                name: 'food.jpg',
                type: 'image/jpeg',
              } as any);
              try {
                setIsUploading(true)
                const response = (await uploadFoodImage(formData) as FoodInfo);
                const foodInfo = (response as { data?: FoodInfo }).data;
                console.log(response);
                if (response) {
                  alert(`Food: ${foodInfo?.label}\nCalories per 100g: ${foodInfo?.caloriesPer100g}`);
                } else {
                  alert('Image uploaded, but no food info returned.');
                }
              } catch (err) {
                alert('Failed to upload image.');
              } finally {
                setIsUploading(false)
              }
            }
          }
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Gallery permission is required!');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: false,
              quality: 0.7,
            });
            if (!result.canceled && result.assets && result.assets.length > 0) {
              const selectedImage = result.assets[0];
              const formData = new FormData();
              formData.append('image', {
                uri: selectedImage.uri,
                name: 'food.jpg',
                type: 'image/jpeg',
              } as any);
              try {
                setIsUploading(true)
                const response = (await uploadFoodImage(formData) as FoodInfo);
                const foodInfo = (response as { data?: FoodInfo }).data;
                if (response) {
                  alert(`Food: ${foodInfo?.label}\nCalories per 100g: ${foodInfo?.caloriesPer100g}`);
                } else {
                  alert('Image uploaded, but no food info returned.');
                }
              } catch (err) {
                alert('Failed to upload image.');
              } finally {
                setIsUploading(false)
              }
            }
          }
        },
        { text: "Cancel", style: "cancel" }
      ]
    );
  };
  return (
    <>
      {isUploading && (
        <View style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(255,255,255,0.5)',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <ActivityIndicator size="large" color={Color.darkPurple} />
        </View>
      )}
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: Color.darkPurple,
            height: 100,
            paddingTop: 5,
            paddingBottom: 5,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            elevation: 10,
            overflow: 'hidden',
          },
          tabBarInactiveTintColor: Color.white,
          tabBarActiveTintColor: Color.lightPurple,
          tabBarShowLabel: true,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Home"
          component={Home}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="home" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Favorite"
          component={Favorite}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="favorite" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Scan"
          component={() => null}
          options={{
            tabBarLabel: "Scan",
            tabBarIcon: ({ color, size }) => (
              <Icon name="camera-alt" color={color} size={size} />
            ),
            tabBarButton: (props) => {
              const navigation = useNavigation<import('@react-navigation/native').NavigationProp<RootStackParamList>>(); // ⬅️ Typed navigation

              return (
                <TouchableOpacity
                  onPress={() => navigation.navigate("ScanFood")}
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    top: -17,
                  }}
                >
                  <Icon name="camera-alt" color="white" size={28} />
                  <Text style={{ color: "white", fontSize: 12 }}>Scan</Text>
                </TouchableOpacity>
              );
            },
          }}
        />

        <Tab.Screen
          name="History"
          component={History}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="history" color={color} size={size} />,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => <Icon name="person" color={color} size={size} />,
          }}
        />
      </Tab.Navigator>
    </>
  );
}
