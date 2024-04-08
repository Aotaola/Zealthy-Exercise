import React from "react";
import Ticket from "./Ticket.jsx"

const TicketDispenser = ({adminInfo}) => {
    return (
        <div className="ticket-dispenser">
            <Ticket adminInfo={adminInfo}/>
        </div>
    )
}

export default TicketDispenser;


