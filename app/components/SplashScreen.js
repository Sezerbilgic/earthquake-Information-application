import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import {
    View,Text,Image,StyleSheet
} from 'react-native';


const SplashScreen = ({navigation}) => {
    setTimeout(() => {
        navigation.replace('Home');
    },3000); 

    return (
        <View style = {style.container}>
            <Image style = {{bottom : 70}} source = {require('../images/logotext.png')} />
        </View>
    )
}

const style = StyleSheet.create({
    container : {
        alignItems : 'center',
        justifyContent : 'center',
        backgroundColor : '#136A8A',
        height : '100%'
    },
  });

export default SplashScreen;