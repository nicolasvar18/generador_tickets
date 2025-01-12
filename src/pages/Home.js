import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import TicketForm from '../components/Formulario'; // Asegúrate de importar correctamente tu componente de formulario
import '../css/home.css';

const Home = () => {
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(!loading);
        }, 2000);
        return () => clearTimeout(timeout);
    }, [loading]);

    const handleAdminClick = () => {
        setShowModal(true);
    };

    const handleAdminAccess = () => {
        if (login(password)) {
            navigate('/admin');
        } else {
            alert('Contraseña incorrecta');
        }
        setShowModal(false);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <div className='container_grid'>
            <button onClick={handleAdminClick} style={{ position: 'absolute', top: '1.5rem' }} className='boton_admin'>Admin</button>
            <div className='tickets_logo'>
                {/* Aquí integras el formulario directamente */}
                <TicketForm />
                {/* <div className='icono_repr'></div> */}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', padding: '20px', borderRadius: '10px', zIndex: 1000 }}>
                    <div className='admin_close'>
                        <h2>Admin</h2>
                        <button onClick={handleCloseModal} style={{ textAlign: 'right', cursor: 'pointer' }} className='boton_close'>X</button>
                    </div>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" style={{ padding: '10px', margin: 'auto', display: 'block', width: '85%' }} className='input_password' />
                    <button onClick={handleAdminAccess} style={{ padding: '10px', marginTop: '10px', display: 'block', width: '100%' }} className='boton_start_admin'>Ingresar</button>
                </div>
            )}

            {showModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)', zIndex: 999 }} onClick={handleCloseModal}></div>
            )}
        </div>
    );
};

export default Home;