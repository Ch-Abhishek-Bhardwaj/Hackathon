const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
  fullName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  tags: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  attachment: {
    type: String, // This will store the file path/name
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'closed'],
    default: 'open'
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);
