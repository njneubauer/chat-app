import React, { Component } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from "expo-camera";
import * as Location from 'expo-location';
import propTypes from "prop-types";
import firebase from "firebase";

export default class CustomActions extends Component{

    pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        try{
            if(status === 'granted'){
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error => console.log(error));
            
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            } 
        } catch(error){
            console.log(error);
        }
    }

    takePhoto = async() => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        try{
            if(status === 'granted'){
                let result = await ImagePicker.launchCameraAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images,
                }).catch(error=>console.log(error));
                
                if (!result.cancelled){
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch(error){
            console.log(error);
        }
    }

    geoLocation = async()=>{
        const { status } = await Location.requestForegroundPermissionsAsync();
        try{
            if(status === 'granted'){
                let result = await Location.getCurrentPositionAsync({});
                if(!result.cancelled){
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        }
                    });
                }
            }
        } catch(error){
            console.log(error);
        }
    }

    uploadImageFetch = async(uri)=>{
        // generate blob code for images
        const blob = await new Promise((resolve, reject)=>{
            const xhr = new XMLHttpRequest();
            xhr.onload = function(){
                resolve(xhr.response);
            };
            xhr.onerror = function(error){
                console.log(error);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });
        console.log(uri);
        // Split URL to form image path
        const imageNameBefore = uri.split('/');
        const imageName = imageNameBefore[imageNameBefore.length - 1];
        console.log(imageName);

        // create snapshot and upload blob code to firebase
        var ref = firebase.storage().ref().child(`images/${imageName}`);
        const snapshot = await ref.put(blob);
        
        blob.close();

        // download image from firebase storage
        return await snapshot.ref.getDownloadURL();
    }

    onActionPress = () => {
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
          {
            options,
            cancelButtonIndex,
          },
          async (buttonIndex) => {
            switch (buttonIndex) {
              case 0:
                this.pickImage();
                return;
              case 1:
                this.takePhoto();
                return;
              case 2:
                this.geoLocation();
              default:
            }
          },
        );
      };

    render(){
        return(
            <TouchableOpacity  style={[styles.container]} onPress={this.onActionPress}>
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }

}

CustomActions.contextTypes={
    actionSheet: propTypes.func
}

styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
      },
      wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
      },
      iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
      },
});