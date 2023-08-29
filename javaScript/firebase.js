import { initializeApp } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js";
import { getAuth , createUserWithEmailAndPassword , signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.3.0/firebase-firestore.js";
// import { getDatabase, ref, set } from"https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL} from "https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js";

 
 const firebaseConfig = {
   apiKey: "AIzaSyD7x-hnLRut59WaCA4SiN_HGBqbnpNngZI",
   authDomain: "blog-app-a8820.firebaseapp.com",
   projectId: "blog-app-a8820",
   storageBucket: "blog-app-a8820.appspot.com",
   messagingSenderId: "306176913336",
   appId: "1:306176913336:web:9a8b9677d09acaa0eda94d"
 };
 
 const app = initializeApp(firebaseConfig);
 const auth = getAuth(app);
 const db = getFirestore(app);
//  const database = getDatabase(app);
 const storage = getStorage(app);

 export { createUserWithEmailAndPassword ,auth ,db ,doc, setDoc , signInWithEmailAndPassword, onAuthStateChanged, signOut, ref,
   uploadBytesResumable, getDownloadURL,storage}