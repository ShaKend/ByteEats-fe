import React, { useState } from "react";
import {Text, View, StyleSheet, SafeAreaView} from "react-native";
import { Color } from "styles/Color";
import { useRoute } from "@react-navigation/native";

type RouteParams = {
  action: 'reset' | 'change';
  email?: string;
};

function ResetPassword() {
  return (
    <SafeAreaView style={styles.container}>
      <Text>Reset Password</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Color.lightPurple,
    flex: 1,
  },
});

export default ResetPassword;
