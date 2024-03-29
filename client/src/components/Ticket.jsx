import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../authFile/AuthContext'; 

const Ticket = () => {
    const { isAdmin } = useAuth();

    const [ticket, setTicket] = useState([]);

    const fetchTicket = async () => {
        try {
            const response = await fetch('https://zealthy-ticket-exercise-5b9751ab0e6c.herokuapp.com/api/tickets', {
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

    // delete ticket
    const deleteTicket = async (ticketId) => {
        try {
            const response = await fetch(`https://zealthy-ticket-exercise-5b9751ab0e6c.herokuapp.com/api/tickets/${ticketId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            // const updatedTicket = await response.json();
            // setTicket(ticket.map(ticket => ticket.id === ticketId ? updatedTicket : ticket))
    
            console.log("Ticket deleted successfully");
    
        } catch (error) {
            console.error("Error deleting ticket:", error);
        }
    };

    
    useEffect(() => {
        fetchTicket();
    }, []);

        // ticket in progress
    const statusInProgress = async (ticketId) => {
        try {
            const response = await fetch(`https://zealthy-ticket-exercise-5b9751ab0e6c.herokuapp.com/api/tickets/${ticketId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'in progress'}),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            console.log(ticket.updated_at)
            const updatedTicket = await response.json();
            setTicket(ticket.map(ticket => ticket.id === ticketId ? updatedTicket : ticket))
    
            console.log("Ticket status updated to 'in progress' successfully");
        
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };

    // compleated
    const statusCompleted = async (ticketId) => {
        try {
            const response = await fetch(`https://zealthy-ticket-exercise-5b9751ab0e6c.herokuapp.com/api/tickets/${ticketId}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status: 'completed' }),
            });
    
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const updatedTicket = await response.json();
            setTicket(ticket.map(ticket => ticket.id === ticketId ? updatedTicket : ticket))

            console.log("Ticket status updated to 'completed' successfully");
            console.log("Would normally send email here with body... your issue has been resolved!");
        
        } catch (error) {
            console.error("Error updating ticket status:", error);
        }
    };
    

    // changing the timestamp to be more readable
    const formatDate = (timestamp) => {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        }).format(new Date(timestamp));
    };
    
    

    return(
        <div className="ticket-container">
        {ticket.map((ticket) => (
            <div key={ticket.id} className={`ticket-card ${isAdmin ? 'ticket-card-admin' : ''}`}>
                <h3>{ticket.name}</h3>
                <p>Email: {ticket.email}</p>
                <p>Issue: {ticket.message}</p>
                <p>status: {ticket.status || "new"}</p>
                <p>submited: {formatDate(ticket.created_at)}</p>
                {/* <p>last update: {formatDate(ticket.updated_at)}</p> */}
                <div className='status-buttons'>
                    <button onClick={() => statusInProgress(ticket.id)} className='in-progress'>In Progress</button>
                    <button onClick={() => statusCompleted(ticket.id)}className='completed'>Completed</button>
                    <button onClick={() => deleteTicket(ticket.id)}className='delete-ticket'>Delete Ticket</button>
                </div>
            </div>
        ))}
    </div>
    )
}

export default Ticket