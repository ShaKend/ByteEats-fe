import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";

import Login from "../views/login/Login";
import Sign from "../views/login/Sign";
import Home from "../views/home/Home";
import BottomTabs from "./BottomTabs";
import OnBoardingA from "views/OnBoarding/OnBoardingA";
import OnBoardingB from "views/OnBoarding/OnBoardingB";
import Verification from "views/Verification";
import Detail from "../views/DetailFood/Detail";
import BreakfastMenu from '../views/category/BreakfastMenu';
import LunchMenu from '../views/category/LunchMenu';
import DinnerMenu from '../views/category/DinnerMenu';
import Search from "../views/search/Search";
import ScanFood from "views/scan/ScanFood";

const Stack = createStackNavigator();

export default function NavigationStack() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="OnBoardingA" screenOptions={{headerShown: false}}>
                <Stack.Screen name="OnBoardingA" component={OnBoardingA} />
                <Stack.Screen name="OnBoardingB" component={OnBoardingB} />
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Sign" component={Sign} />
                <Stack.Screen name="Verification" component={Verification} />
                <Stack.Screen name="Home" component={BottomTabs} />
                <Stack.Screen name="Detail" component={Detail} />
                <Stack.Screen name="BreakfastMenu" component={BreakfastMenu} />
                <Stack.Screen name="LunchMenu" component={LunchMenu} />
                <Stack.Screen name="DinnerMenu" component={DinnerMenu} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="ScanFood" component={ScanFood} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
