import { Color } from "../../styles/Color";
import { StyleSheet, View, Text } from "react-native";


function DividerMedia(){
    return(
        <View style={styles.container}>
            <View style={styles.line} />
            <Text style={styles.text}>Or</Text>
            <View style={styles.line} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row', // Supaya garis dan teks sejajar
        alignItems: 'center', 
        marginTop: 30
      },
      line: {
        flex: 1,
        height: 1,
        backgroundColor: Color.darkPurple
      },
      text: {
        marginHorizontal: 10, // Jarak antara teks dan garis
        fontSize: 14,
        fontWeight: 'bold',
        color: Color.darkPurple
      }
});

export default DividerMedia;


