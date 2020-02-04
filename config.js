module.exports = function(RED) {
  "use strict";
  var firebase = require("firebase/app");

  // Add the Firebase
  require("firebase/auth");
  require("firebase/database");

  const firebaseConfig = {
    apiKey: "AIzaSyBnbSCjJ9eQtAMl_CHRSJxelF5XG8UlLjU",
    authDomain: "smartlife-air.firebaseapp.com",
    databaseURL: "https://smartlife-air.firebaseio.com",
    projectId: "smartlife-air",
    storageBucket: "smartlife-air.appspot.com",
    messagingSenderId: "121967033816",
    appId: "1:121967033816:web:222bbc68de21111ac0c6ad",
    measurementId: "G-YHBTVPG19R"
  };

  function loginNode(n) {
    RED.nodes.createNode(this, n);

    // Initialize Firebase

    if (!firebase.apps.length && n.email && n.password) {
      firebase.initializeApp(firebaseConfig);
      this.auth = firebase.auth();
      this.db = firebase.database();

      this.auth.signInWithEmailAndPassword(n.email, n.password).catch(error => {
        // Handle Errors here.
        console.log(error.message);
      });

      this.auth.onAuthStateChanged(function(user) {
        if (user) {
          // User is signed in.

          this.uid = user.uid;
          // ...
        } else {
          // User is signed out.
        }
      });
    }
  }
  RED.nodes.registerType("smartlifeair-login", loginNode);
};
