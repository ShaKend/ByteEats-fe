import React from "react";
import {Text, View, StyleSheet, SafeAreaView} from "react-native";
import { Color } from "styles/Color";

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
