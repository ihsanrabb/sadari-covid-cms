import * as firebase from "firebase"

var firebaseConfig = {
  apiKey: "AIzaSyCizEhc-xO0JZj89Jc7abhkn8_NyezWstg",
  authDomain: "sadari-covid.firebaseapp.com",
  databaseURL: "https://sadari-covid.firebaseio.com",
  projectId: "sadari-covid",
  storageBucket: "sadari-covid.appspot.com",
  messagingSenderId: "365726266584",
  appId: "1:365726266584:web:b4bab5e72e395ce10f13ad",
  measurementId: "G-T8DLJBPKES"
};
// Initialize Firebase
let fireDB = firebase.initializeApp(firebaseConfig);
firebase.analytics();

export default fireDB.database().ref()