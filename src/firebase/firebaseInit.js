import firebase from "firebase/app"
import "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDV-t3jboFXh5oPXF4qxz0LLEzm-ZsNhDA",
  authDomain: "restaurant-menagment.firebaseapp.com",
  projectId: "restaurant-menagment",
  storageBucket: "restaurant-menagment.appspot.com",
  messagingSenderId: "658548971968",
  appId: "1:658548971968:web:d2d86f07d5207f59c79025"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);

  export default firebaseApp.firestore();