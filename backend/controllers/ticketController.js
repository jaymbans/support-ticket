const asyncHandler = require('express-async-handler');

const User = require('../models/userModel');
const Ticket = require('../models/ticketModel');
const { restart } = require('nodemon');

// @desc    Get user tickets
// @route   GET req: /api/tickets
// @access  Private
const getTickets = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401);
    throw new Error('User not Found!')
  }

  const tickets = await Ticket.find({ user: req.user.id })

  res.status(200).json(tickets)
})


// @desc    Get user ticket
// @route   GET req: /api/tickets/:id
// @access  Private
const getTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401);
    throw new Error('User not Found!')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found!')
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  res.status(200).json(ticket)
})


// @desc    Create user tickets
// @route   POST req: /api/tickets
// @access  Private
const createTicket = asyncHandler(async (req, res) => {
  const { product, description } = req.body;

  if (!product || !description) {
    res.status(400);
    throw new Error('Please choose a product and add a description')
  }

  // find user
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401);
    throw new Error('User not Found!')
  }

  const ticket = await Ticket.create({
    product,
    description,
    user: req.user.id,
    status: 'requested'
  })

  res.status(201).json(ticket)
})

// @desc    Delete ticket
// @route   DELETE req: /api/tickets/:id
// @access  Private
const deleteTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401);
    throw new Error('User not Found!')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found!')
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  await ticket.remove()

  res.status(200).json({ success: true })
})

// @desc    Update ticket
// @route   PUT req: /api/tickets/:id
// @access  Private
const updateTicket = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id)

  if (!user) {
    res.status(401);
    throw new Error('User not Found!')
  }

  const ticket = await Ticket.findById(req.params.id)

  if (!ticket) {
    res.status(404);
    throw new Error('Ticket not found!')
  }

  if (ticket.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('Not Authorized');
  }

  const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true })

  res.status(200).json(updatedTicket)
})

module.exports = {
  getTickets,
  createTicket,
  getTicket,
  deleteTicket,
  updateTicket
}