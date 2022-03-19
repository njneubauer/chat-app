import React, { Component } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    TouchableHighlight,
    TouchableOpacity,
    ImageBackground, 
    Image,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform
} from 'react-native';
import backgroundImg from '../assets/Background-Image.png';
import icon from '../assets/userIcon.png';

export default class Start extends Component {
  constructor(){
    super();
    this.state = {
      selectedColor: '#474056', 
      textColor: '#ffffff',
      name: '',
      keyboardState: false
    }
  }

    render(){
        return (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
                <ImageBackground source={backgroundImg} resizeMode="cover" style={styles.backgroundImage}>
                    
                    {/* App title */}
                    <View style={[ styles.titleBox ]}>
                      <Text style={styles.title}>Welcome to</Text>
                      <Text style={styles.title}>Chitter-Chatter!</Text>
                    </View>
                    <View>{this.state.keyboardState}</View>

                    {/* fix keyboard hiding content issue */}
                    <KeyboardAvoidingView
                    behavior={"position"}
                    keyboardVerticalOffset={Platform.OS === "ios" ? 55 : -300}
                    style={{ alignItems: "center", justifyContent: "center", height: "auto", width: "100%", padding: 0 }}
                    >

                    {/* container for content box that holds UI to enter chat room */}
                    <View style={styles.contentBox}>
                      <View style={styles.inputBox}>
                        <Image source={icon} style={styles.userIcon} />
                        <TextInput 
                            placeholder="Your Name"
                            style={styles.input}
                            value={this.state.name}
                            onChangeText={(name) => this.setState({name})}
                        />
                      </View>
                      
                      {/* Color pallette to choose color of chat background */}
                      <Text style={styles.colorText}>Choose Background Color:</Text>
                      <View style={styles.colorPallet}>
                        <TouchableOpacity onPress={() => this.setState({selectedColor: "#090C08", textColor: '#ffffff' })} style={[ styles.circle1, styles.color1 ]}>
                          <TouchableOpacity activeOpacity={1} style={[ this.state.selectedColor === "#090C08" ? styles.circle2 : styles.hide ]}></TouchableOpacity>                        
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({selectedColor: "#474056", textColor: '#ffffff'})} style={[ styles.circle1, styles.color2 ]}>
                          <TouchableOpacity activeOpacity={1} style={[ this.state.selectedColor === "#474056" ? styles.circle2 : styles.hide ]}></TouchableOpacity>  
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({selectedColor: "#8A95A5", textColor: '#000000'})} style={[ styles.circle1, styles.color3 ]}>
                          <TouchableOpacity activeOpacity={1} style={[ this.state.selectedColor === "#8A95A5" ? styles.circle2 : styles.hide ]}></TouchableOpacity>  
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => this.setState({selectedColor: "#B9C6AE", textColor: '#000000'})} style={[ styles.circle1, styles.color4 ]}>
                          <TouchableOpacity activeOpacity={1} style={[ this.state.selectedColor === "#B9C6AE" ? styles.circle2 : styles.hide ]}></TouchableOpacity>  
                        </TouchableOpacity>
                      </View>

                      {/* Start chatting button */}
                      <TouchableHighlight 
                        style={styles.button} 
                        onPress={() => this.props.navigation.navigate('Chat', { name: this.state.name, backgroundColor: this.state.selectedColor, textColor: this.state.textColor })}
                        >
                        <View>
                          <Text style={styles.textColor}>Start Chatting</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </KeyboardAvoidingView>
                </ImageBackground>
            </View>
            </TouchableWithoutFeedback>

        );
    }
}

const styles = StyleSheet.create({
  container:{
    flex: 1
  },

  backgroundImage:{
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  titleBox:{
    height: '44%',
    width: '88%',
  },

  title:{
    fontSize: 45,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center"
  },
  
  contentBox:{
    marginTop: 30,
    flexDirection: "column",
    flexShrink: 0,
    minHeight: 280,
    maxHeight: 500,
    padding: 15,
    height: "44%",
    width: "100%",
    justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    bottom: 0
  },

  inputBox:{
    flexDirection: "row",
    height: 50,
    width: "88%",
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 0,
    marginBottom: 10
  },

  userIcon:{
    top: 15,
    marginRight: 10,
    marginLeft: 10
   },

  input:{
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 0.8,
    width: "88%",
  },

  colorText: {
    fontSize: 16,
    fontWeight: "300",
    color: "#757083",
    opacity: 1
  },

  colorPallet:{
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20
  },

  circle1:{
    flexDirection: "row",
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "white",
    marginRight: 6,
    marginLeft: 6
  },

  circle2:{
    flexDirection: "row",
    width: 45,
    height: 45,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: "black",
    left: -5.5,
    top: -5.7
  },
 
  color1:{
    backgroundColor: '#090C08'
  },

  color2:{
    backgroundColor: '#474056'
  },

  color3:{
    backgroundColor: '#8A95A5'
  },

  color4:{
    backgroundColor: '#B9C6AE'
  },

  hide:{
    display: "none"
  },

  button:{
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#757083",
    height: 50,
    minWidth: "88%",
    borderRadius: 10
  },

  textColor:{
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },



});
