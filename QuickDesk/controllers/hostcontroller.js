const Home = require('../models/home');
const Ticket = require('../models/ticket');
const fs = require('fs'); 



exports.getAddHome = (req, res, next) => {
    console.log(req.url, req.method);
    res.render('host/edit-home', { pageTitle: 'Add home to airbnb',
        editing: false,
        isLoggedIn: req.isLoggedIn,
        user: req.session.user,
     });
};

exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === 'true';

  Home.findById(homeId).then(home => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    console.log(homeId, editing, home);
    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.session.user,
    });
  });
};


exports.getHostHomes = async (req, res, next) => {
    try {
        // Fetch only tickets data
        const tickets = await Ticket.find().sort({ createdAt: -1 }); // Get all tickets, latest first
        
        res.render('host/host-home-list', {
            tickets: tickets,
            pageTitle: 'QuickDesk - Ticket Dashboard',
            isLoggedIn: req.isLoggedIn,
            user: req.session.user,
        });
    } catch (error) {
        console.error('Error fetching data for ticket dashboard:', error);
        next(error);
    }
};

exports.postAddHome = (req, res, next) => {
  const { housename, price, location, rating, description } = req.body;
  console.log(req.file);
  
  if(!req.file){
    return res.status(422).send("No file uploaded");
  }
  const photo = req.file.filename;

  const home = new Home({ housename, price, location, rating, photo, description });
  home.save()
    .then(() => {
      console.log("Home added successfully", home);
      res.redirect("/host/host-home-list");
    })
    .catch(error => {
      console.log("Error while adding home", error);
      res.redirect("/host/host-home-list");
    });
};

exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } =
    req.body;;
  Home.findById(id)
    .then((home) => {
      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      if (req.file) {
        fs.unlink(home.photo, (err) => {
          if (err) {
            console.log("Error while deleting file ", err);
          }
        });
        home.photo = req.file.path;
      }

      home
        .save()
        .then((result) => {
          console.log("Home updated ", result);
        })
        .catch((err) => {
          console.log("Error while updating ", err);
        });
      res.redirect("/host/host-home-list");
    })
    .catch((err) => {
      console.log("Error while finding home ", err);
    });
};


exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log('Came to delete ', homeId);
  Home.findByIdAndDelete(homeId).then(() => {
    console.log('Home deleted successfully');
    res.redirect("/host/host-home-list");
  }).catch(error => {
    console.log('Error while deleting ', error);
  })
};