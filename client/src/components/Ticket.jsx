import React from 'react';
import { useState, useEffect } from 'react';
import { useAuth } from '../authFile/AuthContext'; 
import { ToastContainer, toast } from 'react-toastify';
import {FaSort, FaSortUp, FaSortDown} from 'react-icons/fa';
import log_out from "../assets/log_out.png"

const Ticket = () => {
    const { isAdmin, adminInfo, logout } = useAuth();

    const [ticket, setTicket] = useState([]);

    const [expandedTicketId, setExpandedTicketId] = useState(null);

    const [message, setMessage] = useState("");

    const [selectedTickets, setSelectedTickets] = useState([]);

    const [sortConfig, setSortConfig] = useState({key: null, direction: null});
    
    const url = process.env.REACT_APP_API_URL || window.REACT_APP_API_URL;


    const fetchTicket = async () => {
        try {
            const response = await fetch(`${url}/api/tickets`, {
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
                const response = await fetch(`${url}/api/tickets/${ticketId}`, {
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
            const response = await fetch(`${url}/api/tickets/${ticketId}/status`, {
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
            const response = await fetch(`${url}/api/tickets/${ticketId}/status`, {
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
    const sendEmail = (ticket, adminInfo) => {

        const emailContent = {
            from: adminInfo.username,
            to: ticket.email,
            message: message
        };
        toast.info(`${emailContent.from} replied ${emailContent.to}`, {
            autoClose: 2500,
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
            return { ...ticket, status: 'completed' };
        }
        return ticket;
    });
    setTicket(updateTicketsComplete); 
    toast.success('tickets updated successfully to "complete"!', {
        autoClose: 2000,
    })

        setSelectedTickets([]);
    };

    // sorting arrows logic
    const handleSort = (key) => {
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            setSortConfig({ key, direction: 'desc' });
        } else {
            setSortConfig({ key, direction: 'asc' });
        }
    }

    // sorting tickets
    const sortTickets = (tickets, sortConfig) => {
        if (!sortConfig.key || !sortConfig.direction) {
            return tickets;
        }

        const statusOrder = { 'new': 1, 'in progress': 2, 'completed': 3};

        const sortedTickets = [...tickets];
        sortedTickets.sort((a, b) => {
            let aValue = a[sortConfig.key];
            let bValue = b[sortConfig.key];

            if (sortConfig.key === 'status') {
                aValue = statusOrder[aValue] || 0;
                bValue = statusOrder[bValue] || 0;
            }

            // if (a[sortConfig.key] < b[sortConfig.key]) {
            if (aValue < bValue) {
                return sortConfig.direction === 'asc' ? -1 : 1;
            }
            // if (a[sortConfig.key] > b[sortConfig.key]) {
            if (aValue > bValue) {
                return sortConfig.direction === 'asc' ? 1 : -1;
            }
            return 0;
        })

        return sortedTickets;
    };


    return(
        <div className="ticket-container">
            <ToastContainer/>
            <div className="actions-table">
                <div className="select-ticket-btns">
                    <button onClick={handleDeleteSelectedTickets} className='selected-button'>Delete tickets</button>
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
                            <th onClick={() => handleSort('status')}>
                                Status
                                {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>)}
                                {sortConfig.key !== 'status' && <FaSort/>}
                                </th>
                            <th onClick={() => handleSort('name')}>
                                Name
                                {sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>)}
                                {sortConfig.key !== 'name' && <FaSort/>}
                                </th>
                            <th onClick={() => handleSort('created_at')}>
                                Submitted
                                {sortConfig.key === 'created_at' && (sortConfig.direction === 'asc' ? <FaSortUp/> : <FaSortDown/>)}
                                {sortConfig.key !== 'created_at' && <FaSort/>}
                                </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortTickets(ticket, sortConfig).map((ticket) => (
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
                                        <button onClick={(e) => sendEmail(ticket, adminInfo)} className='send-reply'>Send</button>
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