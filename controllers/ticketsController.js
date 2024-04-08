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

const getTicketById = async (req, res) => {
  try {
    const { id } = req.params;
    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).send('Ticket no found');
    }

    res.json(ticket);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAllTickets,
  getTicketById,
};
