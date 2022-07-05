const mongoose = require('mongoose');
const { Schema } = mongoose;

const nameSchema = new mongoose.Schema({
    email: String,
    password: String
});

var User = mongoose.model("User", nameSchema);

module.exports = User;