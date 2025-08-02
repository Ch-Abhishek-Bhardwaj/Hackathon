//core module
const path =require('path');
//external module
const express =require('express');
const session =require('express-session');
const multer = require('multer');
const mongodbStore = require('connect-mongodb-session')(session); // for session storage in MongoDB 

const DB_path = "mongodb+srv://programsbyabhishek:Abhi%40123456@cluster0.18idzv.mongodb.net/airbnb?retryWrites=true&w=majority&appName=Cluster0";



//local module
const storeRouter=require("./routes/storeRouter");
const {hostRouter} =require("./routes/hostRouter");
const ticketRouter = require('./routes/ticketRouter');
const rootDir = require("./utils/pathutil");
const { default: mongoose } = require('mongoose');
const authRouter = require('./routes/authRouter');



const app =express();


app.set('view engine', 'ejs');
// app.set('views', path.join(rootDir, 'views'));// to view ejs files in views folder
app.set('views','views');

const store = new mongodbStore({
  uri : DB_path,
  collection: 'sessions' // collection name for storing sessions
})



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

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
}

app.use(express.urlencoded());// to parse form data
// Removed global multer middleware to avoid conflicts with route-specific multer
app.use(express.static(path.join(rootDir, "public")));
app.use("/uploads",express.static(path.join(rootDir, "uploads")));
app.use("/host/uploads",express.static(path.join(rootDir, "uploads")));


app.use(session({
  secret: 'StayFinder',
  resave: false,
  saveUninitialized: true,
  store: store
}));

app.use((req,res,next)=>{
  console.log('cookie check middleware ',req.get('cookie'));
  req.isLoggedIn = req.session.isLoggedIn;
  next(); // check if user is logged in based on session
})


app.use(authRouter);
app.use(ticketRouter); // Add ticket routes
// to serve static files from public folder
// console.log("rootDir is:", rootDir);


//controller
const ErrorController =require('./controllers/error');// error controller
// const storeRouter = require('./routes/storeRouter');

app.use(storeRouter);//imporing router 

app.use("/host",(req,res,next) => {
  if(req.isLoggedIn) {
    next();
  } else {
    res.redirect("/login");
  }
});

app.use("/host", hostRouter);

app.use(ErrorController.error);// using error controller for handling errors


const PORT = 3000;




mongoose.connect(DB_path).then(() => {
  console.log('Connected to Mongoose');
  app.listen(PORT, () => {
    console.log(`Server running on address http://localhost:${PORT}`);
  });
}).catch(err => {
  console.log('Error while connecting to Mongoose: ', err);
});