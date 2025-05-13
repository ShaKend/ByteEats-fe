import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import MenuList, { MenuItem } from '../components/MenuList';

export default function BreakfastMenu() {
  const [data, setData] = useState<MenuItem[]>([]);

  useEffect(() => {
    fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Breakfast')
      .then(response => response.json())
      .then(result => {
        if (result.meals) {
          const meals = result.meals.map((meal: any) => ({
            id: meal.idMeal,
            title: meal.strMeal,
            image: meal.strMealThumb,
          }));
          setData(meals);
        }
      })
      .catch(error => console.error('Gagal fetch data:', error));
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <MenuList title="Breakfast Menu" data={data} showBackArrow={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7e6ff',
  },
});
