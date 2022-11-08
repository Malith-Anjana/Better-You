//import liraries
import { useNavigation } from '@react-navigation/core';
import React, { Component } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { FONT } from '../themes';

// create a component
export const Home = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <Text style={{fontSize:20, fontFamily:FONT.Regular}}>Home</Text>
            <Button title="Chatbot" onPress={()=> navigation.navigate('Chatbot')}/>
            <Button title="Alan" onPress={()=> navigation.navigate('VoiceConversation')}/>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        fontFamily:FONT.Regular,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#2c3e50',
    },
});

