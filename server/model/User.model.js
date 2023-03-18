const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide unique username"],
    unique: [true, "Username already exists"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
  },
  email: {
    type: String,
    required: [true, "Please provide a unique email"],
    unique: [true, "User with this email already exists"],
  },
  firstName: String,
  lastName: String,
  mobile: String,
  address: String,
  profile: String,
});

module.exports = mongoose.model("User", UserSchema);
