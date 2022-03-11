import React, { Component } from 'react';
import Start from './components/Start';
import Chat from './components/Chat';

// import react native gesture handler
import 'react-native-gesture-handler';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


// Create the navigator
const Stack = createStackNavigator();

export default class App extends Component {
  render(){
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteame= "Welcome">
          <Stack.Screen name="Welcome" component={Start} />
          <Stack.Screen name="Chat" component={Chat} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}