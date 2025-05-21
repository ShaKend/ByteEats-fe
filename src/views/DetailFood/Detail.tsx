import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Linking } from 'react-native';
import axios from 'axios';

interface MealDetail {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube: string;
  [key: string]: any;
}

export default function Detail({ route }: any) {
  // Ambil mealId dari route params
  const { mealId } = route.params;
  const [detail, setDetail] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get<{ meals: MealDetail[] | null }>(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
      )
      .then((res) => {
        if (res.data.meals && res.data.meals.length > 0) {
          setDetail(res.data.meals[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [mealId]);

  const renderIngredients = () => {
    if (!detail) return null;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = detail[`strIngredient${i}`];
      const measure = detail[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
      }
    }
    return ingredients.map((item, idx) => (
      <Text key={idx} style={styles.ingredientItem}>• {item}</Text>
    ));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#5D2084" />
      </View>
    );
  }

  if (!detail) {
    return (
      <View style={styles.container}>
        <Text>Meal details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: detail.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{detail.strMeal}</Text>
      <Text style={styles.subtitle}>Category: {detail.strCategory}</Text>
      <Text style={styles.subtitle}>Cuisine: {detail.strArea}</Text>

      <Text style={styles.sectionTitle}>Ingredients:</Text>
      {renderIngredients()}

      <Text style={styles.sectionTitle}>Instructions:</Text>
      <Text style={styles.instructions}>{detail.strInstructions}</Text>

      {detail.strYoutube ? (
        <>
          <Text style={styles.sectionTitle}>Video Tutorial:</Text>
          <Text
            style={styles.link}
            onPress={() => Linking.openURL(detail.strYoutube)}
          >
            Watch on YouTube
          </Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 230,
    borderRadius: 12,
    marginBottom: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5D2084',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    color: '#7A5299',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    color: '#5D2084',
  },
  ingredientItem: {
    fontSize: 16,
    marginBottom: 4,
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  link: {
    fontSize: 16,
    color: '#1E90FF',
    textDecorationLine: 'underline',
    marginTop: 5,
  },
});
