import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

export default function Detail({ route }: any) {
  const { meal } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{meal.strMeal}</Text>
      <Text style={styles.subtitle}>Category: {meal.strCategory}</Text>
      <Text style={styles.description}>ID: {meal.idMeal}</Text>
      {/* Kamu bisa tambahkan info nutrisi, instruksi, dsb di sini */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center'
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  subtitle: {
    fontSize: 18,
    marginVertical: 5
  },
  description: {
    fontSize: 16,
    color: '#666'
  }
});
