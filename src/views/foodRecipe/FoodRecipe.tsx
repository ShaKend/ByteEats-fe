import { View, SafeAreaView, Text, StyleSheet } from "react-native";

function Dashboard(){
    return(
        <SafeAreaView style={styles.container}>
            <Text>This is food recipe page created by Angeline</Text>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 40,
        textAlign: 'center'
    }
});


export default Dashboard;