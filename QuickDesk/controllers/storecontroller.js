
const Home = require('../models/home');
const User = require('../models/user');
const Ticket = require('../models/ticket');


exports.getIndex = async (req, res, next) => {
  try {
    console.log("session value :" , req.session);
    
    // Fetch only tickets data
    const tickets = await Ticket.find().sort({ createdAt: -1 }); // Get all tickets, latest first
    
    res.render("store/index", {
      tickets: tickets,
      pageTitle: "QuickDesk - Support Tickets",
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  } catch (error) {
    console.error('Error fetching data for index:', error);
    next(error);
  }
};


