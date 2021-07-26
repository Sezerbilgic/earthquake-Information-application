import React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './app/navigation/TabNavigator';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from './app/components/SplashScreen';

import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

const Stack = createStackNavigator();

const App = () => {
  return ( 
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SplashScreen" headerMode = 'none' >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  
});

export default App;
