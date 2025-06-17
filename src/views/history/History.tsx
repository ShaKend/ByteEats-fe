import React, { useState, useCallback } from 'react';
import {
  View, Text, SafeAreaView, StyleSheet, Image,
  FlatList, TouchableOpacity, ActivityIndicator, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect, NavigationProp } from '@react-navigation/native';
import moment from 'moment';
import axios from 'axios';
import { useUser } from 'context/UserContext';
import { getUserHistory } from '../../service/ApiServiceUserHistory';
import { deleteUserHistory } from '../../service/ApiServiceUserHistory'; // pastikan ini ada
import { deleteAllUserHistories } from '../../service/ApiServiceUserHistory';

type HistoryItem = {
  idmeal: string;
  name: string;
  date: string;
  image?: string;
};

type ApiHistoryResponse = {
  success: boolean;
  message: string;
  data: {
    idmeal: string;
    createdat: string;
  }[];
};

type RootStackParamList = {
  Home: undefined;
  Favorites: undefined;
  Scan: undefined;
  History: undefined;
  Profile: undefined;
  Detail: { mealId: string };
  // Add other screens if needed
};

const History: React.FC = () => {
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchHistory = async () => {
        if (!user?.userid) {
          Alert.alert("User not found");
          return;
        }
        setLoading(true);
        try {
          const response = await getUserHistory(user.userid) as ApiHistoryResponse;
          const historyArray = Array.isArray(response.data) ? response.data : [];

          const mealPromises = historyArray.map(async (item) => {
            try {
              const res = await axios.get(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${item.idmeal}`);
              const data = res.data as { meals?: any[] };
              const meal = data.meals?.[0];
              return {
                idmeal: item.idmeal,
                name: meal?.strMeal || 'Unknown',
                image: meal?.strMealThumb,
                date: item.createdat,
              };
            } catch {
              return {
                idmeal: item.idmeal,
                name: 'Unknown',
                image: undefined,
                date: item.createdat,
              };
            }
          });

          const historyWithMeals = await Promise.all(mealPromises);

          // Urutkan dari yang terbaru ke yang lama
          const sortedHistory = historyWithMeals.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setHistoryData(sortedHistory);

        } catch (error) {
          Alert.alert("Error fetching history", String(error));
        } finally {
          setLoading(false);
        }
      };

      fetchHistory();
    }, [user?.userid])
  );

  const handleDeleteItem = async (idmeal: string) => {
    if (!user?.userid) return;
    try {
      await deleteUserHistory(user.userid, idmeal);
      setHistoryData(prev => prev.filter(item => item.idmeal !== idmeal));
      Alert.alert("Item deleted");
    } catch (err) {
      Alert.alert("Failed to delete item", String(err));
    }
  };

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity onPress={() => handleItemPress(item)}>
      <View style={styles.item}>
        {item.image && (
          <Image source={{ uri: item.image }} style={styles.image} />
        )}
        <View style={styles.infoContainer}>
          <View style={styles.infoLeft}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.date}>{moment(item.date).format('DD MMM YYYY')}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.date}>{moment(item.date).format('HH:mm')}</Text>

            <TouchableOpacity
              onPress={() => handleDeleteItem(item.idmeal)}
              style={{ marginTop: 5 }}
            >
              <Ionicons name="trash" size={20} color="#5D2084" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const handleItemPress = (item: HistoryItem) => {
    // Pindahkan item ke paling atas
    const updatedHistory = [
      item,
      ...historyData.filter(i => i.idmeal !== item.idmeal)
    ];

    setHistoryData(updatedHistory);

    // Navigasi ke detail
    navigation.navigate('Detail', { mealId: item.idmeal });
  };



  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="purple" />
      </View>
    );
  }

  const handleClearHistory = async () => {
    if (!user?.userid) {
      Alert.alert("User not found");
      return;
    }

    Alert.alert(
      "Clear History",
      "Are you sure you want to clear your history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            try {
              await deleteAllUserHistories(user.userid); // ✅ pakai yang benar
              setHistoryData([]); // kosongkan tampilan history
              Alert.alert("History cleared successfully");
            } catch (error) {
              Alert.alert("Failed to clear history", String(error));
            } finally {
              setLoading(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="purple" />
      </TouchableOpacity>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>History</Text>

        <TouchableOpacity onPress={handleClearHistory}>
          <Text style={{ color: 'red', fontWeight: 'bold' }}>Clear History</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={(item, index) => `${item.idmeal}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View style={styles.center}>
            <Text style={{ color: 'gray' }}>No history yet</Text>
          </View>
        )}
      />

      <View style={styles.navBar}>
        {['Home', 'Favorites', 'Scan', 'History', 'Profile'].map((screen, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate(screen as never)}>
            <Ionicons
              name={
                screen === 'Home' ? 'home' :
                  screen === 'Favorites' ? 'heart' :
                    screen === 'Scan' ? 'scan' :
                      screen === 'History' ? 'time' :
                        'person'
              }
              size={24}
              color="white"
            />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  backButton: { padding: 25, top: 11 },
  item: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: '#ccc',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
  },
  infoLeft: { flex: 1 },
  name: { fontWeight: 'bold', fontSize: 16 },
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
