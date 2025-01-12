import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

// Configuración de Firebase (reemplaza esto con tu propia configuración)
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

// Referencias a servicios de Firebase
const db = firebase.firestore();
const auth = firebase.auth();

// Función para registrar un nuevo usuario
const registrarUsuario = async (email, password) => {
    try {
        const newUser = await auth.createUserWithEmailAndPassword(email, password);
        return newUser;
    } catch (error) {
        console.error("Error al registrar el usuario: ", error);
        throw error;
    }
};

// Función para iniciar sesión
const iniciarSesion = async (email, password) => {
    try {
        const userCredential = await auth.signInWithEmailAndPassword(email, password);
        return userCredential;
    } catch (error) {
        console.error("Error al iniciar sesión: ", error);
        throw error;
    }
};

// Función para cerrar sesión
const cerrarSesion = async () => {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("Error al cerrar sesión: ", error);
        throw error;
    }
};

// Función para agregar un registro a Firestore
const agregarRegistro = async (coleccion, datos) => {
    try {
        const docRef = await db.collection(coleccion).add(datos);
        return docRef.id;
    } catch (error) {
        console.error("Error al agregar registro: ", error);
        throw error;
    }
};

// Función para actualizar un registro en Firestore
const actualizarRegistro = async (coleccion, id, datos) => {
    try {
        await db.collection(coleccion).doc(id).update(datos);
    } catch (error) {
        console.error("Error al actualizar registro: ", error);
        throw error;
    }
};

// Exportar funciones y referencias
export {
    auth,
    db,
    registrarUsuario,
    iniciarSesion,
    cerrarSesion,
    agregarRegistro,
    actualizarRegistro
};
