import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Linking,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/FontAwesome';

import { useUser } from 'context/UserContext';
import { isFavorite, addUserFavorite, deleteUserFavorite } from 'service/ApiServiceUserFavorite';

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

type IsFavoriteResponse = {
  success: boolean;
  message: string;
  isExists: boolean;
};

const nutritionData: Record<
  string,
  {
    calories: number;
    fat?: number;
    saturatedFat?: number;
  }
> = {
  chicken: {
    calories: 165,
    fat: 3.6,
    saturatedFat: 1,
  },
  rice: {
    calories: 130,
    fat: 0.3,
    saturatedFat: 0.1,
  },
  onion: {
    calories: 40,
    fat: 0.1,
    saturatedFat: 0,
  },
  carrots: {
    calories: 41,
    fat: 0.2,
    saturatedFat: 0,
  },
  tomato: {
    calories: 18,
    fat: 0.2,
    saturatedFat: 0,
  },
  cumin: {
    calories: 375,
    fat: 22,
    saturatedFat: 1.5,
  },
  paprika: {
    calories: 282,
    fat: 13,
    saturatedFat: 3.3,
  },
  mint: {
    calories: 70,
    fat: 0.9,
    saturatedFat: 0.1,
  },
  thyme: {
    calories: 101,
    fat: 1.7,
    saturatedFat: 0.3,
  },
  blackpepper: {
    calories: 251,
    fat: 3.3,
    saturatedFat: 0.9,
  },
  water: {
    calories: 0,
    fat: 0,
    saturatedFat: 0,
  },
  garlic: {
    calories: 149,
    fat: 0.5,
    saturatedFat: 0.1,
  },
  beef: {
    calories: 250,
    fat: 15,
    saturatedFat: 6,
  },
  bread: {
    calories: 265,
    fat: 3.2,
    saturatedFat: 0.5,
  },
  pork: {
    calories: 242,
    fat: 14,
    saturatedFat: 5,
  },
};

function parseMeasureToGrams(measure: string): number {
  if (!measure) return 0;
  const match = measure.match(/[\d.]+/);
  if (match) {
    return parseFloat(match[0]);
  }
  return 0;
}

function findNutritionKey(ingredient: string): string | null {
  if (!ingredient) return null;
  ingredient = ingredient.toLowerCase();
  for (const key of Object.keys(nutritionData)) {
    if (ingredient.includes(key)) {
      return key;
    }
  }
  return null;
}

export default function Detail({ route }: any) {
  const { user } = useUser();
  const { mealId } = route.params;
  const [detail, setDetail] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);

  const [totalCalories, setTotalCalories] = useState(0);
  const [totalFat, setTotalFat] = useState(0);
  const [totalSaturatedFat, setTotalSaturatedFat] = useState(0);

  // State love
  const [isLoved, setIsLoved] = useState(false);

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

  useEffect(() => {
    if (!detail) return;

    let caloriesSum = 0;
    let fatSum = 0;
    let saturatedFatSum = 0;

    for (let i = 1; i <= 20; i++) {
      const ingredient = detail[`strIngredient${i}`];
      const measure = detail[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        const key = findNutritionKey(ingredient);
        const qtyGram = parseMeasureToGrams(measure);
        if (key && qtyGram > 0) {
          const nutrition = nutritionData[key];
          caloriesSum += (nutrition.calories * qtyGram) / 100;
          fatSum += ((nutrition.fat ?? 0) * qtyGram) / 100;
          saturatedFatSum += ((nutrition.saturatedFat ?? 0) * qtyGram) / 100;
        }
      }
    }

    setTotalCalories(caloriesSum);
    setTotalFat(fatSum);
    setTotalSaturatedFat(saturatedFatSum);
  }, [detail]);

    useEffect(() => {
      if (user && mealId) {
        isFavorite(user.userid, mealId)
          .then((res) => {
            setIsLoved(res.isExists ?? false);
          })
          .catch(() => setIsLoved(false));
      }
    }, [user, mealId]);

    const handleLovePress = async () => {
      if (!user) return;
      if (isLoved) {
        // Unlike
        await deleteUserFavorite(user.userid, mealId);
        setIsLoved(false);
      } else {
        // Like
        await addUserFavorite(user.userid, mealId);
        setIsLoved(true);
      }
    };

  const renderIngredients = () => {
    if (!detail) return null;

    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
      const ingredient = detail[`strIngredient${i}`];
      const measure = detail[`strMeasure${i}`];
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(
          `${measure ? measure.trim() : ''} ${ingredient.trim()}`.trim()
        );
      }
    }
    return ingredients.map((item, idx) => (
      <Text key={idx} style={styles.listItem}>
        🍴 {item}
      </Text>
    ));
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', flex: 1 }]}>
        <ActivityIndicator size="large" color="#5D2084" />
      </View>
    );
  }

  function getInstructionSteps(instructions: string): string[] {
    if (!instructions) return [];
    // Split by \r\n or . (period), but keep the period at the end of each step
    // First split by \r\n, then further split each by period.
    const lines = instructions.split(/\r?\n/).flatMap(line =>
      line.split('.').map(s => s.trim()).filter(Boolean).map(s => s + '.')
    );
    // Remove empty or very short steps
    return lines.map(s => s.trim()).filter(s => s.length > 2);
  }

  if (!detail) {
    return (
      <View style={styles.container}>
        <Text>Meal details not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Image source={{ uri: detail.strMealThumb }} style={styles.image} />

      {/* Love button */}
      <TouchableOpacity
        style={styles.loveIconContainer}
        onPress={handleLovePress}
        activeOpacity={0.7}
      >
        <Icon
          name="heart"
          size={32}
          color={isLoved ? '#e62117' : '#aaa'}
        />
      </TouchableOpacity>

      <Text style={styles.title}>{detail.strMeal}</Text>
      <Text style={styles.subheading}>
        {detail.strCategory} • {detail.strArea}
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Ingredients</Text>
        {renderIngredients()}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Estimated Nutrition</Text>
        <Text style={styles.nutritionText}>
          🔥 Calories: {totalCalories.toFixed(0)} kkal
        </Text>
        <Text style={styles.nutritionText}>🥓 Fat: {totalFat.toFixed(1)} g</Text>
        <Text style={styles.nutritionText}>
          🧈 Saturated Fat: {totalSaturatedFat.toFixed(1)} g
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Instructions</Text>
        {getInstructionSteps(detail.strInstructions).map((step, idx) => (
          <Text key={idx} style={styles.instructions}>
            {idx + 1}. {step}
          </Text>
        ))}
      </View>

      {detail.strYoutube ? (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Video Tutorial</Text>
          <TouchableOpacity
            style={styles.youtubeButton}
            onPress={() => Linking.openURL(detail.strYoutube)}
            activeOpacity={0.7}
          >
            <Text style={styles.youtubeButtonText}>▶️ Watch on YouTube</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#F5F0FA',
    flexGrow: 1,
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 7,
  },
  loveIconContainer: {
    position: 'absolute',
    top: 320,
    right: 30,
    zIndex: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4b2e83',
    marginBottom: 6,
  },
  subheading: {
    fontSize: 18,
    color: '#7a5299',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#5D2084',
  },
  listItem: {
    fontSize: 17,
    marginVertical: 4,
    color: '#333',
  },
  instructions: {
    fontSize: 17,
    lineHeight: 24,
    color: '#333',
    marginTop: 5
  },
  nutritionText: {
    fontSize: 18,
    marginVertical: 4,
    color: '#2E7D32',
    fontWeight: '600',
  },
  youtubeButton: {
    backgroundColor: '#e62117',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  youtubeButtonText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '600',
  },
});
