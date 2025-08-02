const path =require('path');

const express =require('express');
const storeRouter=express.Router();

//local
// const rootDir=require("../utils/pathutil");
const { registeredhomes } = require('./hostRouter');

//controller
const homeController =require('../controllers/storecontroller');

storeRouter.get("/",homeController.getIndex);



module.exports = storeRouter;

