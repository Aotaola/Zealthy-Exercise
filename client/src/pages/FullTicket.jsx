import React, { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';


const FullTicket = () => {
    const [ticket, setTicket] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        fetchTicket();
    },[id]);

    console.log(id);

    const fetchTicket = async () => {
        try {
            const response = await fetch(`https://zealthy-ticket-exercise-5b9751ab0e6c.herokuapp.com/api/tickets/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log("Ticket fetched successfully:", data);
            
            // Update state with fetched ticket
            setTicket(data); 
        } catch (error) {
            console.error("Error fetching ticket:", error);
        }
    };

    console.log(ticket);


    return (
        <div className="ticket-container">
            <h1>Ticket Details</h1>
            {ticket ? (
                <div>
                    <p>Name: {ticket.name}</p>
                    <p>Email: {ticket.email}</p>
                    <p>Issue: {ticket.message}</p>
                    <p>Status: {ticket.status}</p>
                    <p>Submitted: {ticket.created_at}</p>
                </div>
            ) : (
                <p>Loading ticket...</p>
            )}
        </div>
    );
}
 
export default FullTicket;