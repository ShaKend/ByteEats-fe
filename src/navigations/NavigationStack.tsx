import React from "react";
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from "@react-navigation/native";

import Login from "../views/login/Login";
import Sign from "../views/login/Sign";
import Home from "../views/home/Home";
import BottomTabs from "./BottomTabs";
import Verification from "views/Verification";
import ResetPassword from "views/resetPass/ResetPassword";

const Stack = createStackNavigator();

export default function NavigationStack(){
    return(
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Sign" component={Sign} />
                <Stack.Screen name="Verification" component={Verification} />
                <Stack.Screen name="ResetPassword" component={ResetPassword} />
                <Stack.Screen name="Home" component={BottomTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
