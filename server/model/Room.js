const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: Number,
    required: true,
    unique: true, // Each room number should be unique
  },
  roomType: {
    type: String,
    required: true,
  },
  hourlyRate: {
    type: Number,
    required: true,
  },
});

//user_id
// Users = {id, }
//Location ={id, location};


// Select UserActivation.name , location
const Room = mongoose.model('Room', roomSchema);

module.exports = Room;
