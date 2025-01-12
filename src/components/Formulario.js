import React, { useState } from "react";
import { db, storage } from "../firebase/firebaseConfig";
import emailjs from 'emailjs-com';
import { useNavigate } from 'react-router-dom';

import '../css/form.css';
import loaderImg from '../img/loader.png';

const Formulario = () => {

    const [nombre, setNombre] = useState("");
    const [fechaTerminado, setFechaTerminado] = useState(null); // Este campo se inicializa vacío
    const [correo, setCorreo] = useState("");
    const [cedula, setCedula] = useState("");
    const [celular, setCelular] = useState("");
    const [ocupacion, setOcupacion] = useState("");
    const [requerimiento, setRequerimiento] = useState("");
    const [archivo, setArchivo] = useState(null);
    const [nombreArchivo, setNombreArchivo] = useState("");
    const navigate = useNavigate();

    // Agregar función para enviar correo
    const sendEmail = (ticketId) => {
        const templateParams = {
            to_name: correo,
            name_last: nombre,
            ticketId: ticketId,
            message: requerimiento,
        };

        emailjs.send('service_hbp85tr', 'template_78a0nfh', templateParams, 'UTnYB-2FRkCYZRPgU')
            .then((response) => {
                console.log('Correo enviado!', response.status, response.text);
            }, (error) => {
                console.log('Error al enviar correo:', error);
            });
    };

    // Función para enviar correo a los administradores
    const sendEmailToAdmins = (ticketId) => {
        const adminEmails = 'admintickets@yopmail.com';
        const templateParams = {
            to_name: adminEmails,
            name_last: 'Admin',
            ticketId: ticketId,
            message: `Se ha generado un nuevo ticket con el ID: ${ticketId} para el usuario ${correo}.`,
        };

        emailjs.send('service_hbp85tr', 'template_78a0nfh', templateParams, 'UTnYB-2FRkCYZRPgU')
            .then((response) => {
                console.log('Correo enviado a los administradores!', response.status, response.text);
            }, (error) => {
                console.log('Error al enviar correo a los administradores:', error);
            });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        let urlArchivo = '';

        // Subir archivo a Firebase Storage si existe
        if (archivo) {
            const archivoRef = storage.ref().child(`documentos/${new Date().getTime()}_${archivo.name}`);
            await archivoRef.put(archivo);
            urlArchivo = await archivoRef.getDownloadURL();
        }

        function showLoadingIndicator() {
            document.getElementById('loadingIndicator').style.display = 'block';
        }

        function hideLoadingIndicator() {
            document.getElementById('loadingIndicator').style.display = 'none';
        }

        // Guardar datos en Firestore
        const nuevoRegistro = {
            nombre,
            fechaTerminado: null, // Campo inicialmente vacío
            correo,
            cedula,
            celular,
            ocupacion,
            requerimiento,
            urlArchivo, // Puede estar vacío si no hay archivo
            fechaHora: new Date(),
            estado: 'Pendiente'
        };

        try {
            showLoadingIndicator();

            setTimeout(async () => {
                const docRef = await db.collection("registros").add(nuevoRegistro);
                hideLoadingIndicator();
                // Restablecer el formulario aquí
                setNombre("");
                setFechaTerminado("");
                setCorreo("");
                setCedula("");
                setCelular("");
                setOcupacion("");
                setRequerimiento("");
                setArchivo(null);
                setNombreArchivo(""); // Restablecer el nombre del archivo

                // Muestra el alerta después de limpiar el formulario
                alert(`Registro exitoso. El ID de tú ticket es: ${docRef.id}`);
                sendEmail(docRef.id); // Enviar correo electrónico después de registrar
                sendEmailToAdmins(docRef.id) //correo administradores
                navigate('/'); // Redirigir al Home después de mostrar la alerta
            }, 3000);
        } catch (error) {
            console.error("Error al guardar el documento: ", error);
        }
    };

    const handleArchivoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size <= 20 * 1024 * 1024) { // Máximo 20MB
                setArchivo(file);
                setNombreArchivo(file.name);
            } else {
                alert("El archivo es demasiado grande. El tamaño máximo es de 20MB.");
                setArchivo(null);
                setNombreArchivo("");
            }
        } else {
            setArchivo(null);
            setNombreArchivo("");
        }
    };

    const handleEliminarArchivo = () => {
        setArchivo(null);
        setNombreArchivo("");
    };

    return (
        <div className="grid_content">
            <div id="loadingIndicator">
                <div className="content_loader">
                    <img src={loaderImg} alt="" id="loader"></img>
                </div>
            </div>

            <div className="container_form">
                <form onSubmit={handleSubmit} className="form">
                    <div>
                        <a href='https://www.nicolasvargas.dev' target='_blank' className='logo'></a>
                    </div>
                    <h1>Radicar Solicitudes</h1>
                    <p>Hola, en este espacio podrás crear tu solicitud que sera atendida a la brevedad.</p>

                    <div className="content_inputs">
                        <input
                            type="email"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            placeholder="Correo"
                            className="input"
                            required
                        />
                    </div>

                    <div className="content_inputs">
                        {/* <input
                            type="number"
                            value={cedula}
                            onChange={(e) => setCedula(e.target.value)}
                            placeholder="Cédula"
                            className="input"
                            required
                        /> */}
                        <input
                            type="tel"
                            pattern="[0-9]{10}"
                            value={celular}
                            onChange={(e) => setCelular(e.target.value)}
                            placeholder="Celular"
                            className="input"
                            required
                        />
                    </div>

                    <div className="content_inputs">
                        <textarea
                            value={requerimiento}
                            onChange={(e) => setRequerimiento(e.target.value)}
                            placeholder="Requerimiento"
                            className="input"
                            required
                        />
                    </div>

                    <span className="border"></span>

                    <div className="file_send">
                        <div className="file">
                            <input type="file" id="archivoInput" onChange={handleArchivoChange} />
                            <label htmlFor="archivoInput" className={`archivoLabel ${archivo ? 'archivoCargado' : ''}`}>
                                {archivo ? (
                                    <div className="archivoInfo">
                                        {nombreArchivo}
                                        <button type="button" className="btnEliminarArchivo" onClick={handleEliminarArchivo}>X</button>
                                    </div>
                                ) : (
                                    <span><i className="fas fa-paperclip"></i> Clic para adjuntar archivo</span>
                                )}
                            </label>
                        </div>

                        <div className="boton">
                            <button type="submit" className="send_btn">Enviar</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Formulario;