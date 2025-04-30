import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import SearchInput from "./SearchInput";
import BackButton from "./BackButton";
import { LinearGradient } from 'expo-linear-gradient';

const allItems = ["Salad", "Noodle", "Burger", "Pizza", "Rice", "Sushi", "Ramen", "Fried Rice", "Pasta"];

const SearchScreen: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(allItems);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearchChange = (text: string) => {
    setSearchText(text);
    if (text.trim() === "") {
      setFilteredItems(allItems);
    } else {
      const filtered = allItems.filter(item =>
        item.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredItems(filtered);
    }
  };

  const handleSearchPress = (term: string) => {
    setSearchText(term);
    handleSearchChange(term);
  };

  const handleRefresh = () => {
    setRecentSearches([]);
  };

  const handleItemPress = (item: string) => {
    if (!recentSearches.includes(item)) {
      setRecentSearches([item, ...recentSearches]);
    }
  };

  return (
    <LinearGradient
      colors={["#BB7AE8", "#FFFFFF"]}
      start={{ x: 0.25, y: 0 }}
      end={{ x: 0.25, y: 0.5 }}
      style={styles.gradientContainer}
    >
      <View style={styles.header}>
        <BackButton onPress={() => {}} />
        <Text style={styles.headerTitle}>Search</Text>
      </View>

      <SearchInput
        value={searchText}
        onChangeText={handleSearchChange}
        placeholder="Search here"
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <View style={styles.recentContainer}>
          {recentSearches.map((term, idx) => (
            <TouchableOpacity key={idx} onPress={() => handleSearchPress(term)}>
              <Text style={styles.recentItem}>{term}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={handleRefresh}>
            <Text style={styles.clearText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Results</Text>
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <Text style={styles.resultItem}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: { paddingHorizontal: 20, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: "600", marginBottom: 10, color: "#333" },
  recentContainer: { flexDirection: "row", flexWrap: "wrap" },
  recentItem: {
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    fontSize: 14,
    marginRight: 8,
    marginBottom: 8,
  },
  clearText: {
    color: "#5D2084",
    fontWeight: "500",
    marginTop: 10,
  },
  resultItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    fontSize: 16,
    color: "#333",
  },
});

export default SearchScreen;
