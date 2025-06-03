import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, ActivityIndicator, } from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { CommonActions, useNavigation } from '@react-navigation/native';

import { useUser } from 'context/UserContext';
import { API } from "../../service/ApiService"

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
    const navigation = useNavigation();
    const { user } = useUser();
    
    // Token expiration check
    useEffect(() => {
        const checkToken = async () => {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    // exp is in seconds since epoch
                    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
                        // Token expired
                        await AsyncStorage.removeItem('token');
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            })
                        );
                        return;
                    }
                } catch (e) {
                    // Invalid token, treat as expired
                    await AsyncStorage.removeItem('token');
                    navigation.dispatch(
                        CommonActions.reset({
                            index: 0,
                            routes: [{ name: 'Login' }],
                        })
                    );
                    return;
                }
            } else {
                // No token, redirect to Login
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                );
                return;
            }
        };
        checkToken();
    }, [navigation]);

    // Fetch meals from API
    useEffect(() => {
        axios
            .get('https://www.themealdb.com/api/json/v1/1/search.php?f=b')
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

    const profileUrl = `${API}/profile-images/${user?.profilepicture}`;

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {/* Greeting */}
                <LinearGradient
                    colors={['#D8BDF7','#E2C9FA', '#fff']}
                    style={styles.headerGradient}
                >
                <View style={styles.header}>
                    <View>
                    <Text style={styles.greeting}>Hello, {user?.username}</Text>
                        <Text style={styles.subtitle}>Achieve Your Nutrition Goals</Text>
                    </View>
                    <Image
                        source={profileUrl ? { uri: profileUrl } : require('../../assets/byte-eats-logo.png')}
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
            </LinearGradient>
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
    headerGradient: {
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 30,
      },
    container: {
        flex: 1,
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
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    searchContainer: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#5D2084',
        borderRadius: 20,
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
        paddingHorizontal: 15,
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
        marginHorizontal: 20,
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
        width: '44%',
        marginVertical: 10,
        marginHorizontal: '3%',
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
