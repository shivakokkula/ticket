const Ticket = require("../models/ticket");
const User = require("../models/user");

exports.createTicket = async (req, res) => {
  const { title, description, type, venue, status, priority, dueDate } = req.body;
  try {
    if (!title || !type || !venue || !status || !priority || !dueDate) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (new Date(dueDate) <= new Date()) {
      return res.status(400).json({ message: "Due date must be in the future" });
    }

    const ticket = new Ticket({
      title,
      description,
      type,
      venue,
      status,
      priority,
      dueDate,
      createdBy: req.user._id,
    });
    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    res.status(400).json({ message: "Ticket creation failed", error });
  }
};

exports.getTickets = async (req, res) => {
  try {
    const { startDate, endDate, status, priority, type, venue } = req.query;
    const query = {};
    if (startDate) query.dueDate = { ...query.dueDate, $gte: startDate };
    if (endDate) query.dueDate = { ...query.dueDate, $lte: endDate };
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (type) query.type = type;
    if (venue) query.venue = venue;
    const tickets = await Ticket.find({ createdBy: req.user._id, ...query });
    res.json(tickets);
  } catch (error) {
    res.status(400).json({ message: "Failed to get tickets", error });
  }
};

exports.getTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const ticket = await Ticket.findOne({ _id: id });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    res.json(ticket);
  }
  catch (error) {
    res.status(400).json({ message: "Failed to get ticket", error });
  }
}

exports.assignTicket = async (req, res) => {
  const { id } = req.params;
  const { user_id } = req.body;
  try {
    const ticket = await Ticket.findOne({ _id: id });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }
    ticket.assignedUsers.push(user_id);
    await ticket.save();
    res.json(ticket);
  }
  catch (error) {
    res.status(400).json({ message: "Failed to assign ticket", error });
  }
}

