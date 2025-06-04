import React, { useEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, Image,
  FlatList, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import moment from 'moment';
import { useUser } from 'context/UserContext';
import { getUserHistory } from '../../service/ApiServiceUserHistory';


type HistoryItem = {
  idmeal: string;
  name: string;
  kcal: string;
  date: string;
  image?: string;
};

const History: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
  const fetchHistory = async () => {
    if (!user?.userid) {
      Alert.alert("User not found");
      return;
    }
    setLoading(true);
    try {
      const response = await getUserHistory(user.userid);
      console.log("API Response:", response); // <-- Tambahkan ini

      if (Array.isArray(response)) {
        setHistoryData(response as HistoryItem[]);
      } else {
        setHistoryData([]);
        Alert.alert("Invalid history data received");
      }
    } catch (error) {
      Alert.alert("Error fetching history", String(error));
    } finally {
      setLoading(false);
    }
  };

  fetchHistory();
}, [user]);


  const renderItem = ({ item }: { item: HistoryItem }) => (
  <View style={styles.item}>
    <View style={styles.info}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.kcal}>{item.kcal}</Text>
      <Text style={styles.date}>{moment(item.date).format('DD MMM YYYY')}</Text>
    </View>
  </View>
);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="purple" />
      </TouchableOpacity>

      <FlatList
        data={historyData}
        keyExtractor={(item, index) => item.idmeal || index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={{ color: 'gray' }}>Tidak ada riwayat makanan.</Text>
          </View>
        )}
      />

      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Home' as never)}>
          <Ionicons name="home" size={24} color="white" />
        </TouchableOpacity>
        <Ionicons name="heart" size={24} color="white" />
        <Ionicons name="scan" size={24} color="white" />
        <Ionicons name="time" size={24} color="white" />
        <Ionicons name="person" size={24} color="white" />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 15 },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ccc',
  },
  info: { marginLeft: 15, justifyContent: 'center' },
  name: { fontWeight: 'bold', fontSize: 16 },
  kcal: { color: 'gray', marginTop: 2 },
  date: { color: 'gray', fontSize: 12 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
