import React, { useEffect, useState } from 'react';
import {
  View,Text,StyleSheet,SafeAreaView,Image,ScrollView,ActivityIndicator,TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Detail: { meal: Meal };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}
 
interface MealResponse {
  meals: Meal[] | null;
}

function Favorites() {
  const [recommendations, setRecommendations] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    axios
      .get('https://www.themealdb.com/api/json/v1/1/search.php?f=b')
      .then((response) => {
        const data = response.data as MealResponse;
        setRecommendations(data.meals || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching meals:', error);
        setLoading(false);
      });
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Favorite Food</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : (
          <View style={styles.foodContainer}>
            {recommendations.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.foodCard}
                onPress={() => navigation.navigate('Detail', { meal: item })}
              >
                <Image source={{ uri: item.strMealThumb }} style={styles.foodImage} />
                <Text style={styles.foodName}>{item.strMeal}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA', // putih abu-abu muda seperti homepage
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#5D2084',
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  foodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  foodCard: {
    width: '47%',
    marginVertical: 10,
    borderRadius: 17,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5D2084',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  foodImage: {
    width: '100%',
    height: 170,
    borderRadius: 15,
  },
  foodName: {
    padding: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Favorites;
