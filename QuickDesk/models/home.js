const mongoose = require('mongoose');

const homeSchema = mongoose.Schema({
  housename: {type: String, required: true},
  price: {type: Number, required: true},
  location: {type: String, required: true},
  rating: {type: Number, required: true},
  description: String,
  photo: String,
});

// homeSchema.pre('findOneAndDelete', async function(next) {
//   console.log("Deleting home with ID");
//   const homeId = this.getQuery()._id;
//   await favourite.deleteMany({ houseId: homeId });
//   next(); 
// })

module.exports = mongoose.model('Home', homeSchema);
