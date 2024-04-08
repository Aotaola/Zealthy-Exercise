import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../authFile/AuthContext'; 
import { ToastContainer, toast } from 'react-toastify';
import log_out from "../assets/log_out.png"

const Ticket = () => {
    const { isAdmin, logout } = useAuth();

    const [ticket, setTicket] = useState([]);

    const [expandedTicketId, setExpandedTicketId] = useState(null);

    const [message, setMessage] = useState("");

    const [selectedTickets, setSelectedTickets] = useState([]);


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

        } catch (error) {
            console.error("Error updating ticket status:", error);
            toast.error("Error updating ticket status:", error);
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

    // Collapse the currently expanded ticket
    const toggleTicketDetails = (ticketId) => {
        if (expandedTicketId === ticketId) {
          setExpandedTicketId(null); 
        } else {
        // Expand the clicked ticket
          setExpandedTicketId(ticketId); 
        }
      };
    
    const ticketDetailsVisible = (ticketId) => {
    return expandedTicketId === ticketId;
    };

    // reply to ticket and log message
    const sendEmail = (ticket) => {

        const emailContent = {
            from: 'admin',
            to: ticket.email,
            message: message
        };
        toast.info(`${emailContent.from} replied ${emailContent.to}`, {
            autoClose: 2000,
        });
        console.log("sending reply:", emailContent);
    }

    /// select tickets to use actions more effectively
   const handleSelectTickets = (event, ticketId) => {
        if (event.target.checked) {
            setSelectedTickets([...selectedTickets, ticketId]);
        } else {
            setSelectedTickets(selectedTickets.filter(id => id !== ticketId));
        }
    };

    // action to delete selected tickets
    const handleDeleteSelectedTickets = async () => {
        const delAllConfirmed = window.confirm('Are you sure you want to delete all selected tickets?')
        if (delAllConfirmed){

        for (const ticketId of selectedTickets) {
            await deleteTicket(ticketId); 
        }
        setTicket(ticket.filter(ticket => !selectedTickets.includes(ticket.id)));
        toast.success('Tickets deleted successfully', {
            autoClose: 2000,
        });
        setSelectedTickets([]);
        }
    };
    
    // action change status to "in progress" to selected tickets
    const handleStatusProgressSelectedTickets = async() => {
        for (const ticketId of selectedTickets) {
            await statusInProgress(ticketId);
        }

        const updateTicketsInProgress = ticket.map(ticket => {
            if (selectedTickets.includes(ticket.id)){
            return { ...ticket, status: 'In progress' };
        }
        return ticket;
        });
        setTicket(updateTicketsInProgress); 
        toast.success('ticket updated successfully to "in progress"', {
            autoClose: 2000,
        });
        setSelectedTickets([]);
    };

    // action change status to "complete" to selected tickets
    const handleStatusCompleteSelectedTickets = async() => {
        for (const ticketId of selectedTickets) {
            await statusCompleted(ticketId);
        }
        const updateTicketsComplete = ticket.map(ticket => {
            if (selectedTickets.includes(ticket.id)){
            return { ...ticket, status: 'Complete' };
        }
        return ticket;
    });
    setTicket(updateTicketsComplete); 
    toast.success('tickets updated successfully to "complete"!', {
        autoClose: 2000,
    })

        setSelectedTickets([]);
    };

    return(
        <div className="ticket-container">
            <ToastContainer/>
            <div className="actions-table">
                <div className="select-ticket-btns">
                    <button onClick={handleDeleteSelectedTickets} className='selected-button'>Delete Selected tickets</button>
                    <button onClick={handleStatusProgressSelectedTickets} className='selected-button'>In Progress</button>
                    <button onClick={handleStatusCompleteSelectedTickets} className='selected-button'>Complete</button>
                </div>
                <button onClick={logout} className="logout-button">
                    <img src={log_out} alt="Log Out" className="logout-icon"/>
                </button>
            </div>
                <table className="ticket-table">
                    <thead className='ticket-table-head'>
                        <tr className='ticket-tr'> 
                            <th>Status</th>
                            <th>Name</th>
                            <th>Submitted</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ticket.map((ticket) => (
                            <>
                            <tr key={ticket.id} className={`ticket-card ${isAdmin ? 'ticket-card-admin' : ''}`}>
                                <input 
                                    type="checkbox"
                                    onChange={(e) => handleSelectTickets(e, ticket.id)}
                                    checked={selectedTickets.includes(ticket.id)}
                                />
                                <td onClick={() => toggleTicketDetails(ticket.id)}>{ticket.status || "new"}</td>
                                <td onClick={() => toggleTicketDetails(ticket.id)}>{ticket.name}</td>
                                <td onClick={() => toggleTicketDetails(ticket.id)}>{formatDate(ticket.created_at)}</td>
                            </tr>
                                {ticketDetailsVisible(ticket.id) && (
                                    <tr className="ticket-details">
                                    <td colSpan="3">
                                        {/* <button onClick={() => deleteTicket(ticket.id)}className='delete-ticket'>
                                            <img src={trash} alt="delete" className="delete-icon"/>
                                        </button> */}
                                        <h3>Message:</h3>
                                        <p>
                                            {ticket.message}
                                        </p>
                                        
                                        <textarea 
                                            className="reply-textarea" 
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder={ticket.email}></textarea>
                                        <button onClick={(e) => sendEmail(ticket)} className='send-reply'>Send</button>
                                    {/* <button onClick={() => statusInProgress(ticket.id)} className='in-progress'>In Progress</button> */}
                                    {/* <button onClick={() => statusCompleted(ticket.id)}className='completed'>Completed</button> */}
                                    </td>
                                    </tr>
                                )}
                            </>
                        ))}
                    </tbody>
                    </table>
        </div>



    )
}

export default Ticket