import React, { useState, useEffect } from 'react';
import { db } from '../firebase/firebaseConfig';
import TicketItem from '../components/TicketItem';

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);

    const fetchTickets = async () => {
        try {
            const response = db.collection('registros');
            const data = await response.get();
            let ticketsArray = [];
            data.docs.forEach(item => {
                const ticketData = item.data();
                ticketsArray.push({ id: item.id, ...ticketData });
            });
            setTickets(ticketsArray);
        } catch (error) {
            console.error("Error al obtener los tickets: ", error);
        }
    };

    const cambiarEstado = async (id, nuevoEstado, fechaTerminado = null) => {
        try {
            const updateData = { estado: nuevoEstado };
            if (fechaTerminado) {
                updateData.fechaTerminado = db.Timestamp.fromDate(fechaTerminado);
            }
    
            await db.collection('registros').doc(id).update(updateData);
            console.log(`Ticket ${id} actualizado con:`, updateData);
    
            await fetchTickets(); // Actualizar la lista de tickets
        } catch (error) {
            console.error("Error al actualizar el estado del ticket: ", error);
        }
    };    

    useEffect(() => {
        fetchTickets();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h1>Dashboard de Administración</h1>
            <div>
                {tickets.map((ticket) => (
                    <TicketItem key={ticket.id} ticket={ticket} cambiarEstado={cambiarEstado} />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;