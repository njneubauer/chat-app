# Chat App

## **Setting up Expo**
* npm install expo-cli --global
* Use expo start command to open project
    * Press **d** on the keyboard to open developer tools web interface
* Look for **CONNECTION** option above QR code
    * If computer and phone are on the same network select **LAN**
    * Otherwise select **Tunnel** option for expo to set up server that can be accessed on any internet connection
* Download **Expo App** for your phone
* Use phone camera to scan QR code to launch the app

## **Key Features**
* A page where users can enter their name and choose a background color for the chat screen before joining the chat.
* A page displaying the conversation, as well as an input field and submit button.
* The chat must provide users with two additional communication features: sending images and location data.
* Data gets stored online and offline.

## **Technical Requirements**
* The app must be written in React Native.
* The app must be developed using Expo.
* The app must be styled according to the given screen design.
* Chat conversations must be stored in Google Firestore Database.
* The app must authenticate users anonymously via Google Firebase authentication.
* Chat conversations must be stored locally.
* The app must let users pick and send images from the phone’s image library.
* The app must let users take pictures with the device’s camera app and send them.
* The app must store images in Firebase Cloud Storage.
* The app must be able to read the user’s location data.

## **Development Decisions**
* Serverless NoSQL database (google firebase) that allows for real-time data synchronization.
* Firestore allows for offline and online use by saving JSON data locally.

## **Future Feature Ideas**
* Add user authentication to create a platform for private conversations between 2 or more users.
