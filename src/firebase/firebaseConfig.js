// Importar las funciones necesarias de Firebase
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDYjzYCheL3zGAY--rlCbxdV509X6VFHuw",
    authDomain: "orderease-45b4a.firebaseapp.com",
    databaseURL: "https://orderease-45b4a-default-rtdb.firebaseio.com",
    projectId: "orderease-45b4a",
    storageBucket: "orderease-45b4a.appspot.com",
    messagingSenderId: "869049307475",
    appId: "1:869049307475:web:0b16549f36df9f85e651a6",
    measurementId: "G-6JBK0R5XXL"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Inicializar Firestore
const db = firebase.firestore();

// Inicializar Firebase Storage
const storage = firebase.storage();

// Exportar las instancias de Firestore y Storage
export { db, storage };
