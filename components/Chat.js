import React, { Component } from 'react';
import { StyleSheet, View, KeyboardAvoidingView, Platform, LogBox } from 'react-native';
import { GiftedChat, InputToolbar, Day, SystemMessage } from 'react-native-gifted-chat';
import NetInfo from '@react-native-community/netinfo';

// Firebase connection
import firebase from 'firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
        isOnline: true,
        uid: 0,
        user: {
          _id: "",
          name: "",
          avatar: ""
        }
    }
    // ignore andriod setting timer warning.
    LogBox.ignoreLogs([
      'Setting a timer',
      'Warning: Async Storage has been extracted from react-native core'
    ]);
    
    // initializing firebaseDB
    if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
    }

    // Firebase collection reference
    this.referenceMessages = firebase.firestore().collection('messages');
  }
  
  async getMessages(){
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({
        messages: JSON.parse(messages)
      });
    } catch(error){
        console.log(error.message);
    }
  }

  componentDidMount(){
    // pass user name to navigation title for chat.js screen
    const { name } = this.props.route.params
    this.props.navigation.setOptions({ title: name });

    NetInfo.fetch().then(connection=>{
      if(connection.isConnected) {
        this.setState({ isOnline: true })
        
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

          // usubscribe to stop listening to messages (called inside componentWillUnmount)
          this.unsubscribe = this.referenceMessages
            .orderBy("createdAt", "desc")
            .onSnapshot(this.onCollectionUpdate);
        });
      }
      else {
        this.setState({ isOnline: false })
        // retrieve messages from AsyncStorage if user is offline
        this.getMessages();
      }
    });
  }

  componentWillUnmount(){
    // delete messages for development purposes
    this.unsubscribe();
    this.authUnsubscribe();
  }

  onCollectionUpdate = (querySnapshot) =>{
    const messages = [];

    // go through each document
    querySnapshot.forEach((doc)=>{
      
      // get the query document's snapshot data
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
    // add message to firebase DB
    const message = this.state.messages[0];
    this.referenceMessages.add({
        _id: message._id,
        text: message.text,
        createdAt: message.createdAt,
        user: this.state.user
    });
  }

  async saveMessages(){
    // saves messages locally
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch(error){
        console.log(error.message);
    }
  }

  onSend(messages = []){
    // Append messages to message state
    this.setState(previousState =>({
      messages: GiftedChat.append(previousState.messages, messages),
    }), ()=>{
      // call add message to add message to firebase
      this.addMessages();
      this.saveMessages();
    });
  }

  async deleteMessages(){
    try {
      await AsyncStorage.removeItem('messages');
      this.setState({
        messages: []
      })
    } catch(error){
      console.log(error.message);
    }
  }

  renderInputToolbar(props){
    if(this.state.isOnline == false){
    }
    else {
      return <InputToolbar {...props} />
    }
  }

  renderSystemMessage(props) {
    return (
      <SystemMessage
        {...props}
        textStyle={{
          color: this.props.route.params.textColor,
        }}
      />
    );
  }

  renderDay(props) {
    return (
      <Day
        {...props}
        textStyle={{
          color: this.props.route.params.textColor,
        }}
      />
    );
  }

  render(){
    // assign color passed from start.js to color variable used to change chat background
    const color  = this.props.route.params.backgroundColor;

    return (
      <View style={[styles.container, { backgroundColor: color }]}>
        <GiftedChat
          renderInputToolbar={ (props)=> this.renderInputToolbar(props) }
          bottomOffset={Platform.OS === 'ios' ? 35 : null}
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.user._id,
            name: this.state.name,
            avatar: this.state.user.avatar
          }}
          renderDay={(props)=>this.renderDay(props)}
          renderSystemMessage={this.renderSystemMessage}
        />
        { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  color: {
    color: 'red'
  }
});
