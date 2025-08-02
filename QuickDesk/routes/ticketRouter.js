const express = require('express');
const multer = require('multer');
const path = require('path');
const ticketController = require('../controllers/ticketController');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/attachments/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Allow specific file types
    const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only images, PDFs, and Word documents are allowed!'));
    }
  }
});

// Routes
router.post('/submit-ticket', upload.single('attachment'), ticketController.submitTicket);
router.get('/tickets', ticketController.getAllTickets);
router.get('/tickets/success', ticketController.showSuccess);
// Specific routes should come before parameterized routes
router.post('/tickets/delete-multiple', ticketController.deleteMultipleTickets);
router.get('/tickets/:id', ticketController.getTicketById);
router.post('/tickets/:id/status', ticketController.updateTicketStatus);
router.delete('/tickets/:id', ticketController.deleteTicket);

module.exports = router;
