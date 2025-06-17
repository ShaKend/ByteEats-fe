import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, SafeAreaView, TextInput, Image,
    ScrollView, ActivityIndicator, TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useUser } from 'context/UserContext';
import { addUserHistory } from '../../service/ApiServiceUserHistory';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface Meal {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
}

type RootStackParamList = {
    Detail: { mealId: string };
    Search: undefined;
};

function Search() {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<Meal[]>([]);
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { user } = useUser();
    const [randomMenus, setRandomMenus] = useState<Meal[]>([]);
    const fetchMeals = (query: string) => {
        setLoading(true);

        const endpoint = query.length === 1 && /^[A-Za-z]$/.test(query)
            ? `https://www.themealdb.com/api/json/v1/1/search.php?f=${query}`
            : `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`;

        axios.get(endpoint)
            .then((response) => {
                const data = response.data as { meals: Meal[] | null };
                const meals = data.meals || [];
                setResults(meals);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching meals:', error);
                setResults([]);
                setLoading(false);
            });
    };
    useEffect(() => {
        // Ambil rekomendasi random meals saat pertama kali render
        getRandomMenus();
        // Jika searchQuery kosong, tampilkan random meals
        if (!searchQuery.trim()) {
            setResults(randomMenus);
        }
        const delay = setTimeout(() => {
            if (searchQuery.trim()) {
                fetchMeals(searchQuery);
                // tampilkan random meals saat input kosong
            } else {
                const fetchRandomMeals = () => {
                    setLoading(true);
                    axios.get('https://www.themealdb.com/api/json/v1/1/random.php') // bisa dipanggil beberapa kali untuk variasi
                        .then((response) => {
                            const data = response.data as { meals: Meal[] | null };
                            const meals = data.meals || [];
                            // Ambil beberapa random meal (panggil API 3–5 kali misalnya)
                            const randoms: Meal[] = [];
                            const fetchMore = async () => {
                                for (let i = 0; i < 4; i++) {
                                    const res = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
                                    const resData = res.data as { meals: Meal[] | null };
                                    if (resData.meals) randoms.push(resData.meals[0]);
                                }
                                setResults([meals[0], ...randoms]); // hasil awal + hasil tambahan
                                setLoading(false);
                            };
                            fetchMore();
                        })
                        .catch((error) => {
                            console.error('Error fetching random meals:', error);
                            setResults([]);
                            setLoading(false);
                        });
                };
                fetchRandomMeals();

            }
        }, 500);

        return () => clearTimeout(delay);
    }, [searchQuery]);
    const getRandomMenus = async () => {
        try {
            const randoms: Meal[] = [];
            for (let i = 0; i < 5; i++) {
                const res = await axios.get('https://www.themealdb.com/api/json/v1/1/random.php');
                const resData = res.data as { meals: Meal[] | null };
                if (resData.meals) randoms.push(resData.meals[0]);
            }
            setRandomMenus(randoms);
        } catch (err) {
            console.error('Error fetching recommended meals:', err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Search Input */}
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#5D2084" style={{ marginRight: 8, marginTop: 15 }} />
            </TouchableOpacity>
            <View style={styles.searchBar}>
                <Icon name="search" size={20} color="#5D2084" style={{ marginRight: 8 }} />
                <TextInput
                    placeholder="Search meals..."
                    style={styles.searchInput}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : (
                <ScrollView contentContainerStyle={styles.resultsContainer}>
                    {results.map((meal) => (
                        <TouchableOpacity
                            key={meal.idMeal}
                            style={styles.mealBox}
                            onPress={async () => {
                                if (user?.userid) {
                                    await addUserHistory(user.userid, meal.idMeal);
                                }
                                navigation.navigate('Detail', { mealId: meal.idMeal });
                            }}
                        >
                            <Text style={styles.mealBoxText}>{meal.strMeal}</Text>
                        </TouchableOpacity>
                    ))}

                    {/* Jika tidak ditemukan */}
                    {results.length === 0 && searchQuery.length > 0 && (
                        <Text style={styles.notFound}>No meals found.</Text>
                    )}

                    <Text style={styles.sectionTitle}>You Might Also Like</Text>
                    <View style={styles.cardWrapper}>
                        {randomMenus.map((meal) => (
                            <TouchableOpacity
                                key={meal.idMeal}
                                style={styles.resultCard}
                                onPress={async () => {
                                    if (user?.userid) {
                                        await addUserHistory(user.userid, meal.idMeal);
                                    }
                                    navigation.navigate('Detail', { mealId: meal.idMeal });
                                }}
                            >
                                <Image source={{ uri: meal.strMealThumb }} style={styles.mealImage} />
                                <Text style={styles.mealName}>{meal.strMeal}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>

            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 30,
        backgroundColor: '#f7e6ff',
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#5D2084',
        borderRadius: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        elevation: 5,
        marginTop: 30,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 10,
        fontSize: 16,
        color: '#000',
    },
    resultCard: {
        width: '47%',
        marginVertical: 10,
        borderRadius: 16,
        overflow: 'hidden',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#5D2084',
        elevation: 5,
    },
    mealImage: {
        width: '100%',
        height: 150,
        borderBottomRightRadius: 16,
        borderBottomLeftRadius: 16,
    },
    mealTextWrapper: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    mealBox: {
        width: '48%', // biar cukup 2 kolom
        height: 35,
        padding: 2,
        marginBottom: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        elevation: 2,
        alignItems: 'center', // teks di tengah
        justifyContent: 'center',
    },

    mealBoxText: {
        fontSize: 12,
        color: '#A173C9',
        textAlign: 'center',
        fontWeight: '500',
    },
    mealText: {
        fontSize: 16,
        color: '#333',
        paddingLeft: 10,
    },
    mealName: {
        padding: 10,
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
    },
    sectionTitle: {
        paddingTop: 30,
        fontSize: 20,
        fontWeight: '600',
        color: '#5D2084',
        marginTop: 1,
        marginBottom: 10,
        marginRight: 50,
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    cardWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    resultsContainer: {
        paddingTop: 30,
        paddingBottom: 100,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    notFound: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },

});

export default Search;
