import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class App extends Component {
    render(){
      let name = this.props.route.params.name;
      this.props.navigation.setOptions({ title: name });
      let color = this.props.route.params.backgroundColor;
      return (
        <View style={[styles.container, {backgroundColor: color}]}>
            <Text>Get Chatting!</Text>
            <Text>BackgroundColor: {color}</Text>
        </View>
      );
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
