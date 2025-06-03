import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { useUser } from 'context/UserContext';

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
    const { user } = useUser();

    // Fetch meals from API
    useEffect(() => {
        axios
            .get('https://www.themealdb.com/api/json/v1/1/search.php?f=b') // API to fetch meal data
            .then((response) => {
                const data = response.data as MealResponse;
                if (data.meals) {
                    setRecommendations(data.meals); // Set the fetched meals
                } else {
                    setRecommendations([]); // No meals found, set an empty array
                }
                setLoading(false); // Set loading to false after the API call
            })
            .catch((error) => {
                console.error('Error fetching meals:', error); // Handle error
                setLoading(false);
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Favorite Food Title */}
                <Text style={styles.title}>Favorite Food</Text>

                {/* Displaying Food Images */}
                {loading ? (
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.foodContainer}>
                        {recommendations.map((item, index) => (
                            <View key={index} style={styles.foodCard}>
                                <Image
                                    source={{ uri: item.strMealThumb }} // Image from API
                                    style={styles.foodImage}
                                />
                                <Text style={styles.foodName}>{item.strMeal}</Text>
                            </View>
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
        backgroundColor: '#fff',
    },
    scrollContent: {
        paddingBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5D2084', // Purple color for the title
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
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#5D2084', // Purple border color
    },
    foodImage: {
        width: '100%',
        height: 170,
        borderRadius: 12,
    },
    foodName: {
        padding: 10,
        textAlign: 'center',
        fontWeight: '600',
    },
});

export default Favorites;
