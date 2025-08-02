const mongoose = require('mongoose');



const userSchema = mongoose.Schema({
  firstName :{
    type: String,
    required: [true, 'first name is required']
  },
  lastName :{
    type: String
  },
  email :{
    type: String,
    required: [true, 'email is required']
  },
  password :{
    type: String,
    required: [true, 'password is required']
  },
  UserType :{
    type: String,
    enum: ['guest', 'host', 'agents'],
    default: 'guest'
  },  
  favourites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Home'
  }]
});



module.exports = mongoose.model('User', userSchema);
