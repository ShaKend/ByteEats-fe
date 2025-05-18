import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MenuList, { MenuItem } from '../components/MenuList';

export default function LunchMenu() {
  const [data, setData] = useState<MenuItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const chickenResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken');
        const pastaResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Pasta');
        const vegetarianResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Vegetarian');

        const chickenData = await chickenResponse.json();
        const pastaData = await pastaResponse.json();
        const vegetarianData = await vegetarianResponse.json();

        const allMeals = [
          ...(chickenData.meals || []),
          ...(pastaData.meals || []),
          ...(vegetarianData.meals || [])
        ];

        const shuffledMeals = shuffleArray(allMeals);

        const meals = shuffledMeals.slice(0, 10).map((meal: any) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
        }));

        setData(meals);
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchData();
  }, []);

  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <SafeAreaView style={styles.container}>
      <MenuList title="Lunch Menu" data={data} showBackArrow={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7e6ff',
  },
});
