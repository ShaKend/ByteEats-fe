import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";

import Login from "../views/login/Login";
import Sign from "../views/login/Sign";
import Home from "../views/home/Home";
import BottomTabs from "./BottomTabs";
import Detail from "../views/DetailFood/Detail";
import BreakfastMenu from '../views/category/BreakfastMenu';
import LunchMenu from '../views/category/LunchMenu';
import DinnerMenu from '../views/category/DinnerMenu';
import Verification from "views/login/Verification";

const Stack = createStackNavigator();

export default function NavigationStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Sign" component={Sign} />
                <Stack.Screen name="Verification" component={Verification} />
                <Stack.Screen name="Home" component={BottomTabs} />
                <Stack.Screen name="Detail" component={Detail} />
                <Stack.Screen name="BreakfastMenu" component={BreakfastMenu} />
                <Stack.Screen name="LunchMenu" component={LunchMenu} />
                <Stack.Screen name="DinnerMenu" component={DinnerMenu} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
