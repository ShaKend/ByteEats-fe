import React from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import {
  FoodItemImage,
  FoodItemDescription,
  QuantitySelector,
} from "./FoodItemComponents";
import {
  NutritionSummary,
  NutritionDetails,
} from "./NutritionComponents";
import BackButton from "./BackButton";


const FoodItemDetail: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" translucent backgroundColor="transparent" />

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <LinearGradient
          colors={["#BB7AE8", "#FFFFFF"]}
          start={{ x: 0.125, y: 0 }}
          end={{ x: 0.125, y: 0.25 }}
          style={StyleSheet.absoluteFill}
        />

        <BackButton onPress={() => {}} />
        <View style={styles.container}>
          <Text style={styles.title}>Cheese Burger</Text>

          <FoodItemImage
            imageSource={require("../../assets/cheeseburger.jpg")}
            altText="Cheese Burger"
          />

          <View style={styles.content}>
            <FoodItemDescription description="A delicious burger with four slices and perfect for breakfast/lunch." />

            <View style={styles.headerRow}>
              <Text style={styles.itemTitle}>Cheese Burger</Text>
              <QuantitySelector />
            </View>

            <NutritionSummary />

            <Text style={styles.sectionTitle}>Nutritional Information</Text>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.label}>Serving Size</Text>
              <Text style={styles.value}>100g</Text>
            </View>

            <Text style={styles.label}>Per serve</Text>

            <NutritionDetails />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 30,
  },
  container: {
    flex: 1,
  },
  title: {
    alignSelf: "center",
    justifyContent: "center",
    fontSize: 28,
    fontWeight: "bold",
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 24,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  sectionTitle: {
    textAlign: "center",
    fontSize: 22,
    fontWeight: "600",
    marginTop: 32,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  value: {
    fontSize: 16,
  },
  divider: {
    height: 7,
    backgroundColor: "#BB94D5",
    marginVertical: 16,
  },
});

export default FoodItemDetail;
