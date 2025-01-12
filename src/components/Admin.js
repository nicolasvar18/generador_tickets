import React, { useEffect, useState } from 'react';
import { db } from '../firebase/firebaseConfig';
import TicketItem from '../components/TicketItem';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import ExcelJS from 'exceljs';
import '../css/admin.css';

const Admin = () => {
    const [registros, setRegistros] = useState([]);
    const [terminoBusqueda, setTerminoBusqueda] = useState('');
    const [registrosFiltrados, setRegistrosFiltrados] = useState([]);
    const [mostrarPendientes, setMostrarPendientes] = useState(false);
    const [mostrarEnProceso, setMostrarEnProceso] = useState(false);
    const [mostrarTerminados, setMostrarTerminados] = useState(false);
    const [botonActivo, setBotonActivo] = useState('todos');

    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const fetchRegistros = async () => {
        try {
            const response = await db.collection('registros').get();
            let registrosArray = [];
            response.docs.forEach(item => {
                registrosArray.push({ id: item.id, ...item.data() });
            });
            setRegistros(registrosArray);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
            return;
        }

        fetchRegistros();
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        let filtrados = registros;

        if (terminoBusqueda !== '') {
            filtrados = filtrados.filter(registro => {
                return registro.nombre.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                    registro.apellido.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                    registro.correo.toLowerCase().includes(terminoBusqueda.toLowerCase()) ||
                    registro.id.toLowerCase().includes(terminoBusqueda.toLowerCase());
            });
        }

        if (mostrarPendientes) {
            filtrados = filtrados.filter(registro => registro.estado === 'Pendiente');
        } else if (mostrarEnProceso) {
            filtrados = filtrados.filter(registro => registro.estado === 'En Proceso');
        } else if (mostrarTerminados) {
            filtrados = filtrados.filter(registro => registro.estado === 'Terminado');
        } else {
            filtrados = filtrados.filter(registro => registro.estado !== 'Terminado');
        }

        filtrados.sort((a, b) => a.fechaHora - b.fechaHora);

        setRegistrosFiltrados(filtrados);
    }, [terminoBusqueda, registros, mostrarPendientes, mostrarEnProceso, mostrarTerminados]);

    const cambiarEstado = async (id, nuevoEstado) => {
        try {
            await db.collection('registros').doc(id).update({ estado: nuevoEstado });
            fetchRegistros();
        } catch (error) {
            console.error("Error al actualizar el estado: ", error);
        }
    };

    const asignarEncargado = async (id, encargado) => {
        try {
            await db.collection('registros').doc(id).update({ encargado });
            fetchRegistros();
        } catch (error) {
            console.error("Error al asignar encargado: ", error);
        }
    };

    const formatFechaHora = (timestamp) => {
        if (timestamp && timestamp.seconds) {
            const date = new Date(timestamp.seconds * 1000);
            return date.toLocaleString('es-ES', { timeZone: 'UTC' });
        }
        return 'No disponible';
    };

    const downloadExcel = async () => {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Registros');

        worksheet.columns = [
            { header: 'ID', key: 'id', width: 10 },
            { header: 'Correo', key: 'correo', width: 30 },
            { header: 'Estado', key: 'estado', width: 15 },
            { header: 'Requerimiento', key: 'requerimiento', width: 15 },
            { header: 'Encargado', key: 'encargado', width: 20 },
            { header: 'Fecha y Hora', key: 'fechaHora', width: 20 }
        ];

        registros.forEach(registro => {
            worksheet.addRow({
                id: registro.id,
                correo: registro.correo,
                estado: registro.estado,
                encargado: registro.encargado,
                requerimiento: registro.requerimiento,
                fechaHora: formatFechaHora(registro.fechaHora)
            });
        });

        const buffer = await workbook.xlsx.writeBuffer();
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.download = 'registros.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className='margen_admin'>
            <div className='title_admin_boton'>
                <div className='tlt_icon'>
                    <a href='www.nicolasvargas.dev' target='_blank'>
                        <span className='logo'></span>
                    </a>
                </div>

                <h1 className='title_main'>Administración de Registros</h1>
                <h1 className='title_second'>Administración</h1>
                <div>
                    <button onClick={downloadExcel} className='boton_home' style={{ marginRight: '30px', backgroundColor:'#4B97C5' }}>Descargar Excel</button>
                    <a href="/" >
                        <button className='boton_home'>Inicio</button>
                    </a>
                </div>
            </div>

            <div className='content_search_buttons'>
                <input
                    type="text"
                    value={terminoBusqueda}
                    onChange={(e) => setTerminoBusqueda(e.target.value)}
                    className='input_search'
                    placeholder="Buscar por correo o id..."
                />

                <div className='botones_functions'>
                    <button className={`buttons_funct wdmax ${botonActivo === 'todos' ? 'active' : ''}`} onClick={() => { setBotonActivo('todos'); setMostrarPendientes(false); setMostrarEnProceso(false); setMostrarTerminados(false); }}>Mostrar todos</button>
                    <button className={`buttons_funct wdmax ${botonActivo === 'pendientes' ? 'active' : ''}`} onClick={() => { setBotonActivo('pendientes'); setMostrarPendientes(true); setMostrarEnProceso(false); setMostrarTerminados(false); }}>Mostrar pendientes</button>
                    <button className={`buttons_funct wdmax ${botonActivo === 'enProceso' ? 'active' : ''}`} onClick={() => { setBotonActivo('enProceso'); setMostrarPendientes(false); setMostrarEnProceso(true); setMostrarTerminados(false); }}>Mostrar en proceso</button>
                    <button className={`buttons_funct wdmax ${botonActivo === 'terminados' ? 'active' : ''}`} onClick={() => { setBotonActivo('terminados'); setMostrarPendientes(false); setMostrarEnProceso(false); setMostrarTerminados(true); }}>Mostrar terminados</button>

                    <button className={`buttons_funct wdmin ${botonActivo === 'todos' ? 'active' : ''}`} onClick={() => { setBotonActivo('todos'); setMostrarPendientes(false); setMostrarEnProceso(false); setMostrarTerminados(false); }}>Mostrar todos</button>
                    <button className={`buttons_funct wdmin ${botonActivo === 'pendientes' ? 'active' : ''}`} onClick={() => { setBotonActivo('pendientes'); setMostrarPendientes(true); setMostrarEnProceso(false); setMostrarTerminados(false); }}>Pendientes</button>
                    <button className={`buttons_funct wdmin ${botonActivo === 'enProceso' ? 'active' : ''}`} onClick={() => { setBotonActivo('enProceso'); setMostrarPendientes(false); setMostrarEnProceso(true); setMostrarTerminados(false); }}>En proceso</button>
                    <button className={`buttons_funct wdmin ${botonActivo === 'terminados' ? 'active' : ''}`} onClick={() => { setBotonActivo('terminados'); setMostrarPendientes(false); setMostrarEnProceso(false); setMostrarTerminados(true); }}>Terminados</button>
                </div>
            </div>

            <div className='content_tickitem'>
                {registrosFiltrados.map((registro) => (
                    <TicketItem key={registro.id} ticket={registro} cambiarEstado={cambiarEstado} asignarEncargado={asignarEncargado} />
                ))}
            </div>
        </div>
    );
};

export default Admin;