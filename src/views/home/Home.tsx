import { View, SafeAreaView, Text, StyleSheet } from "react-native";

function Home(){
    console.log("Home page loaded!");
    
    return(
        <SafeAreaView style={styles.container}>
            <Text>This is dashboard property made by sharlene!</Text>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container: {
        padding: 40,
        textAlign: 'center'
    }
});


export default Home;