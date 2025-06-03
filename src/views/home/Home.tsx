import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TextInput, Image, ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";
import { CommonActions, useNavigation } from '@react-navigation/native';

import { useUser } from 'context/UserContext';
import { API } from "../../service/ApiService"
import { StackNavigationProp } from '@react-navigation/stack';

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

interface MealResponse {
    meals: Meal[] | null;
}

type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    Sign: undefined;
    Detail: { mealId: string };
    BreakfastMenu: undefined;
    LunchMenu: undefined;
    DinnerMenu: undefined;
};

function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [recommendations, setRecommendations] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation<StackNavigationProp<RootStackParamList, 'Home'>>();
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

    const onCategoryPress = (category: string) => {
        if (category === 'Breakfast') {
            navigation.navigate('BreakfastMenu');
        } else if (category === 'Lunch') {
            navigation.navigate('LunchMenu');
        } else if (category === 'Dinner') {
            navigation.navigate('DinnerMenu');
        }
    };

    const fetchMeals = (query: string) => {
        setLoading(true);

        const endpoint = query.length === 1 && /^[A-Za-z]$/.test(query)
            ? `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`
            : `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

        axios
            .get(endpoint)
            .then((response) => {
                const data = response.data as MealResponse;
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
    };

    useEffect(() => {
        fetchMeals('');
        const fetchUsername = async () => {
            const storedUsername = await AsyncStorage.getItem('username');
            setUsername(storedUsername);
        };
        fetchUsername();
    }, []);

    const profileUrl = `${API}/profile-images/${user?.profilepicture}`;

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchMeals(searchQuery);
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={['#D8BDF7', '#E2C9FA', '#F5F5F5']}
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
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>
            </LinearGradient>

            <ScrollView>
                {/* Food Categories */}
                <View style={styles.categoryContainer}>
                    <TouchableOpacity style={styles.categoryBox} onPress={() => onCategoryPress('Breakfast')}>
                        <Image
                            source={require('../../assets/PaindeMie.png')}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Breakfast</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryBox} onPress={() => onCategoryPress('Lunch')}>
                        <Image
                            source={require('../../assets/JapaneseCurry.png')}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Lunch</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.categoryBox} onPress={() => onCategoryPress('Dinner')}>
                        <Image
                            source={require('../../assets/Steak.png')}
                            style={styles.categoryImage}
                        />
                        <Text style={styles.categoryText}>Dinner</Text>
                    </TouchableOpacity>
                </View>

                {/* Recommendations */}
                <Text style={styles.recommendationTitle}>Recommendation For You!</Text>
                {loading ? (
                    <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
                ) : (
                    <View style={styles.recommendationContainer}>
                        {recommendations.map((item) => (
                            <TouchableOpacity
                                key={item.idMeal}
                                style={styles.recommendationCard}
                                onPress={() => navigation.navigate('Detail', { mealId: item.idMeal })}
                            >
                                <Image source={{ uri: item.strMealThumb }} style={styles.recommendationImage} />
                                <Text style={styles.recommendationText}>{item.strMeal}</Text>
                            </TouchableOpacity>
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
        backgroundColor: '#F5F5F5',
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
        elevation: 10,
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
        elevation: 5,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
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
        elevation: 5,
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
        paddingHorizontal: 10,
    },
    recommendationCard: {
        width: '43%',
        marginVertical: 10,
        marginHorizontal: '3%',
        borderWidth: 1,
        borderColor: '#5D2084',
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#fff',
        elevation: 4,
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
