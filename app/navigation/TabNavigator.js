import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Image, 
    TouchableOpacity
} from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../components/HomeScreen';
import SearchScreen from '../components/SearchScreen';

const Tab = createBottomTabNavigator()

const TabNavigator = () => {
    return (
      <Tab.Navigator
        tabBarOptions = {{
          showLabel : false,
          style :  {
            position : 'absolute',
            bottom : 15,
            left : 40,
            right : 40,
            elevation : 0,
            backgroundColor : '#ffffff',
            borderRadius : 15,
            height : 70,
            ...styles.shadow
          }
        }}
      >
          <Tab.Screen  name='Home' component={HomeScreen}  options={{
            tabBarIcon: ({focused}) => (
              <View style = {{alignItems : 'center' , justifyContent : 'center' , top : 0}}>
                <Image 
                source = {require('../images/bighome.png')}
                resizeMode = 'contain'
                style = {{
                  width : 30,
                  height : 30,
                  tintColor : focused ? '#e32f45' : '#748c94'
                }}
                />
                <Text style = {{color : focused ? '#e32f45' : '#748c94' , fontSize : 15}}>Ana Sayfa</Text>
              </View>
            ),
          }} />
          <Tab.Screen  name='Search' component={SearchScreen} options={{
            tabBarIcon: ({focused}) => (
              <View style = {{alignItems : 'center' , justifyContent : 'center' , top : 0}}>
                <Image 
                source = {require('../images/loupe.png')}
                resizeMode = 'contain'
                style = {{
                  width : 30,
                  height : 30,
                  tintColor : focused ? '#e32f45' : '#748c94'
                }}
                />
                <Text style = {{color : focused ? '#e32f45' : '#748c94' , fontSize : 15}}>Arama</Text>
              </View>
            ),
          }}/>
      </Tab.Navigator>
    );
  };
  
  const styles = StyleSheet.create({
    shadow : {
      shadowColor : '#000000',
      shadowOffset : {
        width : 0,
        height : 20,
      },
      shadowOpacity : 0.5,
      shadowRadius : 3,
      elevation : 15
    }
  });
  
  export default TabNavigator;