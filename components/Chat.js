import React, { Component } from 'react';
import { StyleSheet, Text, View, KeyboardAvoidingView, keyboard } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { backgroundColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';

export default class App extends Component {
  constructor(){
    super();
      this.state = {
        messages: [],
      }
  }

  componentDidMount(){
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          }
        },
        {
          _id: 2,
          text: 'This is a system message',
          createdAt: new Date(),
          system: true,
        },
      ]
    });
  }

  onSend(messages = []){
    this.setState(previousState =>({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render(){
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title: name });
    let color = this.props.route.params.backgroundColor;

    return (
      <View style={[styles.container, {backgroundColor: `${color}` }]}>
        <GiftedChat 
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{ _id: 1 }}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
});
