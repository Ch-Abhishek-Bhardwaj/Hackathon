const express =require('express');
const multer = require('multer');
const path = require('path');
const hostRouter=express.Router();

//local
const rootDir= require("../utils/pathutil")

//adding controller
const hostController =require('../controllers/hostcontroller');

// Configure multer for home photo uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter
});

hostRouter.get("/add-home",hostController.getAddHome);

hostRouter.post("/add-home", upload.single('photo'), hostController.postAddHome);

hostRouter.get("/host-home-list",hostController.getHostHomes);

hostRouter.get("/edit-home/:homeId",hostController.getEditHome);

hostRouter.post("/edit-home", upload.single('photo'), hostController.postEditHome);

hostRouter.post("/delete-home/:homeId",hostController.postDeleteHome);


exports.hostRouter = hostRouter;