import React, { useEffect, useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,Text,StyleSheet,SafeAreaView,Image,ScrollView,ActivityIndicator,TouchableOpacity,
} from 'react-native';
import axios from 'axios';

import { useUser } from 'context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { getAllUserFavorite } from 'service/ApiServiceUserFavorite';

type RootStackParamList = {
  Detail: { meal: Meal };
};

type NavigationProp = StackNavigationProp<RootStackParamList, 'Detail'>;

interface Meal {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

type Favorite = {
  userid: string;
  idmeal: string | number;
}

interface MealResponse {
  meals: Meal[] | null;
}

function Favorites() {
  const [recommendations, setRecommendations] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();
  const navigation = useNavigation<NavigationProp>();

useFocusEffect(
  useCallback(() => {
    const fetchFavorites = async () => {
      if (!user?.userid) {
        setError('User not found.');
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const response = await getAllUserFavorite(user.userid);
        const favoritesArray =
          Array.isArray((response as any).data)
            ? (response as any).data
            : Array.isArray((response as any)?.favorites)
            ? (response as any).favorites
            : [];
        setFavorites(favoritesArray);

        const mealPromises = favoritesArray.map(async (fav: Favorite) => {
          const res = await axios.get<MealResponse>(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${fav.idmeal}`
          );
          return res.data.meals?.[0];
        });

        const meals = await Promise.all(mealPromises);
        const validMeals = meals.filter((meal): meal is Meal => !!meal);
        setRecommendations(validMeals);
      } catch (err) {
        setError('Failed to load favorites.');
        setRecommendations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user])
);



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Favorite Food</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 20 }}>{error}</Text>
        ) : favorites.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No favorites yet.</Text>
        ) : (
          <View style={styles.foodContainer}>
          {recommendations.map((meal, index) => (
            <TouchableOpacity
              key={meal.idMeal || index}
              style={styles.foodCard}
              onPress={() => navigation.navigate('Detail', { meal })}
            >
              <Image source={{ uri: meal.strMealThumb }} style={styles.foodImage} />
              <Text style={styles.foodName}>{meal.strMeal}</Text>
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
