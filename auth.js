// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getDatabase, ref, child, get, set } from "firebase/database";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signOut,
} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export class Auth {
  constructor() {
    this.firebaseConfig = {
      apiKey: "AIzaSyAmw1hWHilbZiEk3tzjvumIdPBKTVyUctQ",
      authDomain: "da-dhmt.firebaseapp.com",
      projectId: "da-dhmt",
      storageBucket: "da-dhmt.appspot.com",
      messagingSenderId: "441808228326",
      appId: "1:441808228326:web:4682e9ec98879291df9027",
      measurementId: "G-QYPMEXC8L2",
      databaseURL: "https://da-dhmt-default-rtdb.firebaseio.com/",
    };
    this.app = initializeApp(this.firebaseConfig);
    this.analytics = getAnalytics(this.app);
    this.auth = getAuth(this.app);
    this.provider = new GoogleAuthProvider();
    this.database = getDatabase();
  }

 signIn() {
    signInWithPopup(this.auth, this.provider)
      .then( async(result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = {
          uid: result.user.uid,
          displayName: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          lastSignInTime: result.user.metadata.lastSignInTime,
        };
        localStorage.setItem("user", JSON.stringify(user));
        const dbRef = ref(getDatabase());
        await get(child(dbRef, 'users/' + user.uid + '/models')).then((snapshot) => {
            if (snapshot.exists()) {
              localStorage.setItem("models", JSON.stringify(snapshot.val()));
              window.location.assign("/model.html");
            } else {
              console.log("No data available");
            }
          }).catch((error) => {
            console.error(error);
          });

      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        // const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }
  signOut() {
    signOut(this.auth)
      .then(() => {
        // Sign-out successful.
        window.location.assign("/index.html");
      })
      .catch((error) => {
        // An error happened.
      });
  }

}

