import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/MaterialIcons";

import Home from "../views/home/Home";
import Favorite from "../views/favorite/Favorite";
import History from "../views/history/History";
import Profile from "../views/profile/Profile";

import { Color } from "../styles/Color";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: Color.darkPurple,
                    height: 110,
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
    );
}
