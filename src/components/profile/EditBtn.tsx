import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Color } from '../../styles/Color';

interface EditBtnProps {
    onClick?: () => void;
}

const EditBtn: React.FC<EditBtnProps> = ({ onClick }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.button} onPress={onClick}>
                <Icon name="edit" size={20} color={Color.darkPurple} />
                <Text style={styles.text}>Edit Profile</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 40,
    },
    text: {
        color: Color.darkPurple, 
        marginLeft: 5,
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        padding: 10,
        backgroundColor: 'transparent',
        color: '#fff',
        borderColor: Color.darkPurple,
        borderWidth: 1.4,
        borderRadius: 8,
        cursor: 'pointer',
        fontSize: 16,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default EditBtn;