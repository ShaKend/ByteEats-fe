import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ImageSourcePropType,
} from "react-native";

interface FoodItemDescriptionProps {
  description: string;
}

export const FoodItemDescription: React.FC<FoodItemDescriptionProps> = ({
  description,
}) => (
  <View style={styles.descriptionContainer}>
    <Text style={styles.descriptionText}>{description}</Text>
  </View>
);

interface FoodItemImageProps {
  imageSource: ImageSourcePropType;
  altText: string;
}

export const FoodItemImage: React.FC<FoodItemImageProps> = ({
  imageSource,
  altText,
}) => (
  <View style={styles.imageWrapper}>
    <Image
      source={imageSource}
      accessibilityLabel={altText}
      style={styles.foodImage}
    />
  </View>
);

export const QuantitySelector: React.FC = () => {
  const [quantity, setQuantity] = useState(1);

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  return (
    <View style={styles.quantityContainer}>
      <TouchableOpacity onPress={decreaseQuantity} style={styles.quantityButton}>
        <Text style={styles.quantitySymbol}>-</Text>
      </TouchableOpacity>

      <View style={styles.quantityTextContainer}>
        <Text style={styles.quantityText}>{quantity}</Text>
      </View>

      <TouchableOpacity onPress={increaseQuantity} style={styles.quantityButton}>
        <Text style={styles.quantitySymbol}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  descriptionContainer: {
    marginBottom: 16,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 22,
  },
  headerContainerGradient: {
    padding: 16,
    alignItems: "center",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  imageWrapper: {
    alignItems: "center",
    marginVertical: 16,
  },
  foodImage: {
    width: 160,
    height: 160,
    resizeMode: "cover",
    borderRadius: 8,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  quantityTextContainer: {
    paddingHorizontal: 16,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
  },
  quantitySymbol: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
