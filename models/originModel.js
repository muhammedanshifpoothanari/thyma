const mongoose = require('mongoose');

const originSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model('origin', originSchema);