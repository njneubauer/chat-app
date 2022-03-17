import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, LogBox } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase connection
import firebase from 'firebase';


// chitter-chatter firebaseConfigs
const firebaseConfig = {
  apiKey: "AIzaSyA7TerF3VFn_4wsRWHPcwdJEnuLXBGXSzQ",
  authDomain: "chat-app-864dc.firebaseapp.com",
  projectId: "chat-app-864dc",
  storageBucket: "chat-app-864dc.appspot.com",
  messagingSenderId: "394581648552",
};

export default class App extends Component {
  constructor(){
    super();
      this.state = {
        messages: [],
        uid: 0,
        user: {
          _id: "",
          name: "",
          avatar: ""
        }
    }

    LogBox.ignoreLogs([
      'Setting a timer',
    ]);
    
    // initializing firebaseDB
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }
  }

  componentDidMount(){
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name });

     // Firebase collection reference
     this.referenceMessages = firebase.firestore().collection('messages');

    // Sign in anonymously if user is not signed in
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        firebase.auth().signInAnonymously();
      }    
      // update user state with currently active user data
      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any"
        }
      });

      this.unsubscribe = this.referenceMessages
        .orderBy("createdAt", "desc")
        .onSnapshot(this.onCollectionUpdate);
    });
  }

  onCollectionUpdate = (querySnapshot) =>{
    const messages = [];

    // go through each document
    querySnapshot.forEach((doc)=>{
      // get the queryDocument's snapshot data
      var data = doc.data(); 
      messages.push({
        _id: data._id,
        text: data.text,
        createdAt: data.createdAt.toDate(),
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({ messages });
  }

  addMessages(){
    const message = this.state.messages[0];
    this.referenceMessages.add({
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: this.state.user
    });
  }


  onSend(messages = []){
    this.setState(previousState =>({
      messages: GiftedChat.append(previousState.messages, messages),
    }), ()=>{
      this.addMessages();
    });
  }

  componentWillUnmount(){
    this.unsubscribe();
    this.authUnsubscribe();
  }

  render(){
    // assign color passed from start.js to color variable used to change chat background
    const color  = this.props.route.params.backgroundColor;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat 
          bottomOffset={Platform.OS === 'ios' ? 35 : null}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar
          }}
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
