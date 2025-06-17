import React, { useState } from "react";
import {
    View,
    Text,
    ActivityIndicator,
    StyleSheet,
    TouchableOpacity,
    Image,
} from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { uploadFoodImage } from "service/ApiServiceFoodScan";
import { Color } from "../../styles/Color";
import { Ionicons } from '@expo/vector-icons';

type FoodInfo = {
    label: string;
    caloriesPer100g: string | number;
};

export default function ScanFood({ navigation }: any) {
    const [isUploading, setIsUploading] = useState(false);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        handleResult(result);
    };

    const takePhoto = async () => {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (permission.status !== "granted") {
            alert("Camera permission is required.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 0.7,
        });
        handleResult(result);
    };

    const handleResult = async (result: any) => {
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedImage = result.assets[0];
            const formData = new FormData();
            formData.append('image', {
                uri: selectedImage.uri,
                name: 'food.jpg',
                type: 'image/jpeg',
            } as any);

            try {
                setIsUploading(true);
                const response = (await uploadFoodImage(formData) as FoodInfo);
                const foodInfo = (response as { data?: FoodInfo }).data;
                if (foodInfo) {
                    alert(`🍽 Food: ${foodInfo.label}\n🔥 Calories per 100g: ${foodInfo.caloriesPer100g}`);
                } else {
                    alert('No food info returned.');
                }
            } catch (e) {
                alert('Upload failed.');
            } finally {
                setIsUploading(false);
            }
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={Color.darkPurple} />
                </TouchableOpacity>
            </View>
            <Text style={styles.title}>Scan Your Food</Text>

            <Image
                source={require('../../assets/foodie.png')}
                style={styles.illustration}
                resizeMode="contain"
            />

            {isUploading && (
                <ActivityIndicator size="large" color={Color.darkPurple} style={{ marginBottom: 20 }} />
            )}

            <TouchableOpacity style={styles.buttonPrimary} onPress={takePhoto}>
                <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.buttonSecondary} onPress={pickImage}>
                <Text style={styles.buttonText}>Choose from Gallery</Text>
            </TouchableOpacity>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F5FF',
        marginTop: 20,
        alignItems: 'center',
        padding: 24,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 10,
        color: Color.darkPurple,
    },
    illustration: {
        width: '100%',
        height: 200,
        marginBottom: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },
    buttonPrimary: {
        backgroundColor: Color.darkPurple,
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 16,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    buttonSecondary: {
        backgroundColor: '#7E3DA1',
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 16,
        marginVertical: 10,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    bottomDecoration: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: 100,
        backgroundColor: 'purple', // bisa kamu ganti warnanya sesuai tema
        borderTopLeftRadius: 100,
        borderTopRightRadius: 100,
        zIndex: -1,
    },

});
