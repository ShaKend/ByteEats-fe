import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type HistoryItem = {
  id: string;
  name: string;
  kcal: string;
  date: string;
  image: { uri: string };
};

const historyData: HistoryItem[] = [
  {
    id: '1',
    name: 'Doughnut',
    kcal: '170 kkal',
    date: '10 February 2025 - 9:56 AM',
    image: { uri: 'https://via.placeholder.com/60' },
  },
  {
    id: '2',
    name: 'Fried Noodle',
    kcal: '360 kkal',
    date: '22 March 2025 - 9:56 AM',
    image: { uri: 'https://via.placeholder.com/60' },
  },
  {
    id: '3',
    name: 'Spaghetti Bolognese',
    kcal: '380 kkal',
    date: '25 March 2025 - 12:56 PM',
    image: { uri: 'https://via.placeholder.com/60' },
  },
  {
    id: '4',
    name: 'Smoothie',
    kcal: '100 kkal',
    date: '25 March 2025 - 12:56 PM',
    image: { uri: 'https://via.placeholder.com/60' },
  },
  {
    id: '5',
    name: 'Black Forest',
    kcal: '350 kkal',
    date: '20 March 2025 - 14:06 PM',
    image: { uri: 'https://via.placeholder.com/60' },
  },
  {
    id: '6',
    name: 'Black Tea',
    kcal: '200 kkal',
    date: '25 March 2025 - 14:06 PM',
    image: { uri: 'https://via.placeholder.com/60' },
  },
];

const History: React.FC = () => {
  const renderItem = ({ item }: { item: HistoryItem }) => (
    <View style={styles.item}>
      <Image source={item.image} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.kcal}>{item.kcal}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color="purple" />
      </TouchableOpacity>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
      <View style={styles.navBar}>
        <Ionicons name="home" size={24} color="white" />
        <Ionicons name="heart" size={24} color="white" />
        <Ionicons name="scan" size={24} color="white" />
        <Ionicons name="time" size={24} color="white" />
        <Ionicons name="person" size={24} color="white" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  backButton: {
    padding: 15,
  },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ccc',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
  },
  info: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  kcal: {
    color: 'gray',
    marginTop: 2,
  },
  date: {
    color: 'gray',
    fontSize: 12,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    height: 60,
    width: '100%',
    backgroundColor: 'purple',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
});

export default History;
