import firebase from 'firebase'

if (!firebase.apps.length) {
  firebase.initializeApp(
    {
      apiKey: "AIzaSyDJQ1ihFkztwGHufoeWyjVbOaMYG7AEdxY",
      authDomain: "twitterpj-7be92.firebaseapp.com",
      projectId: "twitterpj-7be92",
      storageBucket: "twitterpj-7be92.appspot.com",
      messagingSenderId: "339925028243",
      appId: "1:339925028243:web:490d50601ce59dd60e6c66",
      measurementId: "G-HXWC4WRNP1"
    }
  )
}
  
export default firebase