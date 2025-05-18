import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, StyleSheet,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';

export type MenuItem = {
  id: string;
  title: string;
  image: string;
};

type Props = {
  title: string;
  data: MenuItem[];
  showBackArrow?: boolean;
};

type RootStackParamList = {
  Home: undefined;
};

const MenuList = ({ title, data, showBackArrow = true }: Props) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
       <View style={styles.header}>
        {showBackArrow && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Home')}
            style={styles.backArrow}
          >
            <Text style={{ fontSize: 30 }}>←</Text>
          </TouchableOpacity>
        )}
        <Text style={styles.headerText}>{title}</Text>
      </View>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    paddingBottom: 30,
  },
  backArrow: {
    position: 'absolute',
    left: 16,
    fontSize: 30,
    paddingTop: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    textShadowColor: '#aaa',
  },
  list: {
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  card: {
    width: '47%',
    marginVertical: 10,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#5D2084',
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 170,
    borderRadius: 12,
  },
  title: {
    padding: 10,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default MenuList;
