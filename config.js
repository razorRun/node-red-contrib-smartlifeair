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
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }
    if (n.email && n.password) {
      this.auth = firebase.auth();
      this.db = firebase.database();
      let retry = true;
      const login = ()=>{
        if(retry)
          this.auth.signInWithEmailAndPassword(n.email, n.password).catch(error => {
          // Handle Errors here.
          console.log("Smartlife Air: Auth Error From Config Node")
          console.log(error.message);
          retry = true;
          setTimeout(() => {
            login();
          }, 10000);
        });
      }
      this.auth.onAuthStateChanged(function(user) {
        if (user) {
          retry = false;
        } else {
          retry = true;
          login();
        }
      });
    }
  }
  RED.nodes.registerType("smartlifeair-login", loginNode);
};
