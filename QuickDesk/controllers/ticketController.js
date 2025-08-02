const Ticket = require('../models/ticket');
const path = require('path');

// Submit a new ticket
exports.submitTicket = async (req, res) => {
  try {
    const { fullName, email, tags, question, description } = req.body;
    
    // Handle file upload if present
    let attachmentPath = null;
    if (req.file) {
      attachmentPath = req.file.filename;
    }

    // Create new ticket
    const newTicket = new Ticket({
      fullName,
      email,
      tags,
      question,
      description,
      attachment: attachmentPath
    });

    // Save to database
    await newTicket.save();

    // Redirect to host home list to see the submitted ticket
    res.redirect('/host/host-home-list');
    
  } catch (error) {
    console.error('Error submitting ticket:', error);
    res.status(500).render('error', { 
      message: 'Error submitting ticket',
      error: error 
    });
  }
};

// Get all tickets (for admin view)
exports.getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.render('tickets/list', { tickets });
  } catch (error) {
    console.error('Error fetching tickets:', error);
    res.status(500).render('error', { 
      message: 'Error fetching tickets',
      error: error 
    });
  }
};

// Get single ticket by ID
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).render('error', { 
        message: 'Ticket not found' 
      });
    }
    res.render('tickets/detail', { ticket });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    res.status(500).render('error', { 
      message: 'Error fetching ticket',
      error: error 
    });
  }
};

// Show success page
exports.showSuccess = (req, res) => {
  res.render('tickets/success');
};

// Update ticket status
exports.updateTicketStatus = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const { status } = req.body;
    
    // Validate status
    const validStatuses = ['open', 'in-progress', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid status' 
      });
    }

    // Update ticket status
    const updatedTicket = await Ticket.findByIdAndUpdate(
      ticketId, 
      { status: status }, 
      { new: true }
    );

    if (!updatedTicket) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Ticket status updated successfully',
      ticket: updatedTicket 
    });
    
  } catch (error) {
    console.error('Error updating ticket status:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error updating ticket status' 
    });
  }
};

// Delete single ticket
exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    
    // Validate input
    if (!ticketId) {
      return res.status(400).json({ 
        success: false, 
        message: 'No ticket ID provided' 
      });
    }

    // Delete ticket
    const result = await Ticket.findByIdAndDelete(ticketId);

    if (!result) {
      return res.status(404).json({ 
        success: false, 
        message: 'Ticket not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Ticket deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting ticket:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting ticket: ' + error.message 
    });
  }
};

// Delete multiple tickets
exports.deleteMultipleTickets = async (req, res) => {
  console.log("hjwdbfdbfsdbchsdbchdbcdbb test");
  try {
    const { ticketIds } = req.body;
    console.log("hjwdbfdbfsdbchsdbchdbcdbb test")
    console.log('Received request to delete tickets:', ticketIds); // Debug log
    
    // Validate input
    if (!ticketIds || !Array.isArray(ticketIds) || ticketIds.length === 0) {
      console.log('Invalid input - no ticket IDs provided');
      return res.status(400).json({ 
        success: false, 
        message: 'No ticket IDs provided' 
      });
    }

    // Delete tickets
    const result = await Ticket.deleteMany({ 
      _id: { $in: ticketIds } 
    });

    console.log('Delete result:', result); // Debug log

    res.json({ 
      success: true, 
      message: `Successfully deleted ${result.deletedCount} ticket(s)`,
      deletedCount: result.deletedCount
    });
    
  } catch (error) {
    console.error('Error deleting tickets:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting tickets: ' + error.message 
    });
  }
};
