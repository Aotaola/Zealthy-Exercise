const Ticket = require('../models/ticket');

const getAllTickets = async (req, res) => {
  try {
    // Retrieve tickets from the database using the ticket model
    const tickets = await Ticket.findAll();
    res.json(tickets);
  } catch (err) {
    console.error(err.ticket);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllTickets,
};
