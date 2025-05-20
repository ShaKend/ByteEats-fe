import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface NutritionRowProps {
  label: string;
  value: string;
  subLabel?: string;
  subValue?: string;
}

export const NutritionRow: React.FC<NutritionRowProps> = ({
  label,
  value,
  subLabel,
  subValue,
}) => (
  <View style={styles.row}>
    <View style={styles.labelGroup}>
      <Text style={styles.label}>{label}</Text>
      {subLabel && <Text style={styles.subLabel}>{subLabel}</Text>}
    </View>
    <View style={styles.valueGroup}>
      <Text style={styles.value}>{value}</Text>
      {subValue && <Text style={styles.subValue}>{subValue}</Text>}
    </View>
  </View>
);

export const NutritionSummary: React.FC = () => (
  <View style={styles.summaryContainer}>
    <NutritionRow label="Calories" value="168 (0%)" />
    <View style={styles.divider} />
    <NutritionRow label="Total Fat" value="6.23g" />
    <View style={styles.divider} />
    <NutritionRow label="Total Carb" value="21.06g" />
    <View style={styles.divider} />
    <NutritionRow label="Protein" value="6.3g" />
  </View>
);

export const NutritionDetails: React.FC = () => (
  <View>
    <View style={styles.divider} />
    <View style={styles.detailItem}>
      <NutritionRow label="Energy" value="703 kJ" subValue="168 kcal" />
      <View style={styles.divider} />
    </View>
    <View style={styles.detailItem}>
      <NutritionRow label="Fat" value="6.23g" />
      <View style={styles.divider} />
    </View>
    <View style={styles.detailItem}>
      <NutritionRow label="Protein" value="6.3g" />
      <View style={styles.divider} />
    </View>
    <View style={styles.detailItem}>
      <NutritionRow label="Carbohydrates" value="21.06g" />
      <View style={styles.divider} />
    <View style={styles.detailItem}>
      <NutritionRow label="Sugar" value="8g" />
    </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  labelGroup: {
    flex: 1,
  },
  valueGroup: {
    alignItems: "flex-end",
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
  },
  subLabel: {
    fontSize: 14,
    color: "#FFF",
    marginTop: 4,
  },
  value: {
    fontSize: 16,

  },
  subValue: {
    fontSize: 14,
    color: "#FFF",
    marginTop: 4,
  },
  summaryContainer: {
    backgroundColor: "#BB94D5",
    borderRadius: 12,
    padding: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 16,
  },
  divider: {
    height: 3,
    backgroundColor: "#BB94D5",
    marginVertical: 8,
  },
  detailItem: {
    
  },
  subRow: {
    marginLeft: 16,
    marginTop: 8,
  },
});

export default NutritionRow;
