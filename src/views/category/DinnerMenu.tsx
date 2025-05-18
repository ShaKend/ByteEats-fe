import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, FlatList } from 'react-native';
import MenuList, { MenuItem } from '../components/MenuList';

export default function DinnerMenu() {
  const [data, setData] = useState<MenuItem[]>([]);

  useEffect(() => {
    // Fungsi untuk mengambil data dari beberapa kategori dan menggabungkannya
    const fetchData = async () => {
      try {
        // Ambil data dari beberapa kategori
        const beefResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Beef');
        const chickenResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Chicken');
        const pastaResponse = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?c=Pasta');

        const beefData = await beefResponse.json();
        const chickenData = await chickenResponse.json();
        const pastaData = await pastaResponse.json();

        // Gabungkan semua data menjadi satu array
        const allMeals = [
          ...(beefData.meals || []),
          ...(chickenData.meals || []),
          ...(pastaData.meals || [])
        ];

        // Acak data yang sudah digabungkan
        const shuffledMeals = shuffleArray(allMeals);

        // Format data untuk tampilan
        const meals = shuffledMeals.slice(0, 10).map((meal: any) => ({
          id: meal.idMeal,
          title: meal.strMeal,
          image: meal.strMealThumb,
        }));

        setData(meals); // Set data yang telah diacak
      } catch (error) {
        console.error('Error fetching meals:', error);
      }
    };

    fetchData();
  }, []);

  // Fungsi untuk mengacak array
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Tukar elemen
    }
    return array;
  };

  return (
    <SafeAreaView style={styles.container}>
      <MenuList title="Dinner Menu" data={data} showBackArrow={true} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7e6ff',
  },
});
