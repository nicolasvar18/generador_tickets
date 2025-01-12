import React, { useState } from 'react';
import { Tag, Flex } from 'antd';
import { CheckCircleOutlined, SyncOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import emailjs from 'emailjs-com';

function LessText({ ticket }) {
    const [showFullText, setShowFullText] = useState(false);
    const maxWords = 12;

    const toggleText = () => {
        setShowFullText(!showFullText);
    };

    const renderText = () => {
        if (!ticket.requerimiento) return null;

        const words = ticket.requerimiento.split(' ');
        const truncatedText = words.slice(0, maxWords).join(' ');
        const remainingText = words.slice(maxWords).join(' ');

        return (
            <p>
                {showFullText ? ticket.requerimiento : truncatedText}
                {words.length > maxWords && (
                    <>
                        {' '}
                        <button className='boton_less_more_see' onClick={toggleText}>
                            {showFullText ? 'Ver menos' : 'Ver más'}
                        </button>
                        {!showFullText && <span style={{ display: 'none' }}>{remainingText}</span>}
                    </>
                )}
            </p>
        );
    };

    return renderText();
}

const TicketItem = ({ ticket, cambiarEstado, asignarEncargado }) => {
    const [encargado, setEncargado] = useState(ticket.encargado || '');

    const handleEstadoClick = async (nuevoEstado) => {
        try {
            if (nuevoEstado === 'Terminado') {
                const fechaTerminado = new Date(); // Esto crea un nuevo objeto Date
                console.log(`Intentando marcar el ticket ${ticket.id} como terminado en: ${fechaTerminado.toISOString()}`);
                await cambiarEstado(ticket.id, nuevoEstado, fechaTerminado);
                sendResolvedEmail(ticket);
            } else {
                await cambiarEstado(ticket.id, nuevoEstado);
            }
        } catch (error) {
            console.error("Error en handleEstadoClick:", error);
        }
    };    

    const handleEncargadoChange = (e) => {
        setEncargado(e.target.value);
        asignarEncargado(ticket.id, e.target.value);
    };

    const sendResolvedEmail = (ticket) => {
        const templateParams = {
            to_name: ticket.correo,
            from_name: "Tu Empresa o Nombre",
            ticketId: ticket.id,
            message: ticket.requerimiento,
        };

        emailjs.send('service_hbp85tr', 'template_imlqlzo', templateParams, 'UTnYB-2FRkCYZRPgU')
            .then((response) => {
                console.log('Correo de resolución enviado!', response.status, response.text);
            }, (error) => {
                console.log('Error al enviar correo de resolución:', error);
            });
    };

    const fechaFormateada = ticket.fechaHora ? new Date(ticket.fechaHora.seconds * 1000).toLocaleString() : 'No disponible';

    const renderEstadoTag = () => {
        let icon, color;
        switch (ticket.estado) {
            case 'Terminado':
                icon = <CheckCircleOutlined />;
                color = 'success';
                break;
            case 'En Proceso':
                icon = <SyncOutlined spin />;
                color = 'processing';
                break;
            case 'Pendiente':
            default:
                icon = <ExclamationCircleOutlined />;
                color = 'warning';
                break;
        }
        return (
            <Tag icon={icon} color={color}>
                {ticket.estado || 'Pendiente'}
            </Tag>
        );
    };

    return (
        <div className='ticket' style={{ border: '1px solid #e4e4e7', marginBottom: '10px' }}>
            <div className='id_name'>
                <h3 className='id'><strong>ID:</strong> {ticket.id}</h3>
                <div className='content_initials'>
                    <p className='initials_name'>
                        {ticket.correo &&
                            ticket.correo.split('@')[0].split('.')[0].charAt(0) +
                            (ticket.correo.split('.')[1] ? ticket.correo.split('.')[1].charAt(0) : '')
                        }
                    </p>
                </div>
            </div>
            <hr />
            <div className='flex_content'>
                <div className='content_info'>
                    <div className='title_text'>
                        <strong>Correo</strong>
                        <p>{ticket.correo}</p>
                    </div>
                    <div className='title_text'>
                        <strong>Fecha de Registro</strong>
                        <p>{fechaFormateada}</p>
                    </div>
                    <div className='title_text'>
                        <strong>Requerimiento</strong>
                        <LessText ticket={ticket} />
                    </div>
                </div>
                <div className='content_info'>
                    <div className='title_text'>
                        <strong>Celular</strong>
                        <p>{ticket.celular}</p>
                    </div>
                    <div className='title_text'>
                        <strong>Estado</strong>
                        <Flex gap="4px 0" wrap>
                            {renderEstadoTag()}
                        </Flex>
                    </div>
                    {ticket.urlArchivo && (
                        <div className='content_info'>
                            <div className='title_text doct_top'>
                                <strong>Documento</strong>
                                <p className='document'><a href={ticket.urlArchivo} target="_blank" rel="noopener noreferrer">Ver documento</a></p>
                            </div>
                        </div>
                    )}
                    <div className='title_text'>
                        <strong>Encargado</strong>
                        <select value={encargado} onChange={handleEncargadoChange}>
                            <option value="">Asignar encargado</option>
                            <option value="Soporte 1">Soporte 1</option>
                            <option value="Soporte 2">Soporte 2</option>
                            <option value="Soporte 3">Soporte 3</option>
                        </select>
                    </div>
                </div>
            </div>
            <div>
                {/* {renderEstadoTag()} */}
                <button className='progress_button' onClick={() => handleEstadoClick('En Proceso')} style={{ marginRight: '5px' }}>En proceso</button>
                <button className='finished_button' onClick={() => handleEstadoClick('Terminado')}>Terminado</button>
            </div>
        </div>
    );
};

export default TicketItem;