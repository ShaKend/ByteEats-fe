import { View, SafeAreaView, Text, StyleSheet } from "react-native";

function History(){
    return(
        <SafeAreaView style={styles.container}>
            <Text>This is food recipe page created by Cita</Text>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 40,
        textAlign: 'center'
    }
});


export default History;