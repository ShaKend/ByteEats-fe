import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, ActivityIndicator, } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

// Define types
interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

interface MealResponse {
    meals: Meal[] | null;
}

function Home() {
    const [recommendations, setRecommendations] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch meals from API
    useEffect(() => {
        axios
            .get('https://www.themealdb.com/api/json/v1/1/search.php?f=b') // Get meals starting with 'b'
            .then((response) => {
                const data = response.data as MealResponse; // Cast response.data to MealResponse
                if (data.meals) {
                    setRecommendations(data.meals);
                } else {
                    setRecommendations([]);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching meals:', error);
                setLoading(false);
            });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Greeting */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Hello, Lene!</Text>
                        <Text style={styles.subtitle}>Achieve Your Nutrition Goals</Text>
                    </View>
                    <Image
                        source={require('../../assets/profile.png')}
                        style={styles.avatar}
                    />
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon name="search" size={20} color="#5D2084" style={styles.searchIcon} />
                    <TextInput
                        placeholder="Search here"
                        style={styles.searchInput}
                        placeholderTextColor="#888"
                    />
                </View>
                {/* Food Categories */}
                <View style={styles.categoryContainer}>
                    <View style={styles.categoryBox}>
                        <Image
                            source={require('../../assets/PaindeMie.png')}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Breakfast</Text>
                    </View>
                    <View style={styles.categoryBox}>
                        <Image
                            source={require('../../assets/JapaneseCurry.png')}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Lunch</Text>
                    </View>
                    <View style={styles.categoryBox}>
                        <Image
                            source={require('../../assets/Steak.png')}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Dinner</Text>
                    </View>
                </View>

                {/* Recommendations */}
            
                <Text style={styles.recommendationTitle}>Recommendation For You!</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.recommendationContainer}>
                        {recommendations.map((item, index) => (
                        
                            <View key={index} style={styles.recommendationCard}>
                                <Image
                                    source={{ uri: item.strMealThumb }}
                                    style={styles.recommendationImage}
                                />
                                <Text style={styles.recommendationText}>{item.strMeal}</Text>
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
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    header: {
        marginTop: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    greeting: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
    },
    subtitle: {
        fontSize: 14,
        color: '#888888',
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
    },
    search: {
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#5D2084',
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    searchContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#5D2084',
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
    },
    categoryContainer: {
        marginTop: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    categoryBox: {
        width: '30%',
        paddingVertical: 15,
        backgroundColor: '#fff',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#5D2084',
        shadowColor: '#000',          
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 4,
    },
    categoryImage: {
        width: 70,
        height: 50,
        marginBottom: 10,
    },
    categoryText: {
        fontWeight: '600',
    },
    recommendationTitle: {
        marginTop: 30,
        fontSize: 20,
        fontWeight: 'bold',
    },
    recommendationContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    recommendationCard: {
        width: '47%',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#5D2084',
        borderRadius: 12,
        overflow: 'hidden',
        backgroundColor: '#fff',
    },
    recommendationImage: {
        width: '100%',
        height: 170,
        borderRadius: 12,
    },
    recommendationText: {
        padding: 10,
        textAlign: 'center',
    },
});

export default Home;
