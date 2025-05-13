import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

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

const MenuList = ({ title, data, showBackArrow = true }: Props) => {
  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <View style={styles.header}>
        {showBackArrow && <Text style={styles.backArrow}>←</Text>}
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#5D2084',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'center',
    width: '48%',
    paddingVertical: 15,
  },
  image: {
    width: '90%',
    height: 180,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  title: {
    marginTop: 12,
    fontWeight: '600',
    fontSize: 14,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
});

export default MenuList;
