const { Router } = require("express");
const {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  createResetSession,
  verifyOTP,
  resetPassword,
  verifyUser,
} = require("../controllers/app.controller");
const mailer = require("../controllers/mailer");
const { Auth, localVariables } = require("../middleware/auth");
const router = new Router();

// POST METHODS
router.route("/register").post(register); // register user
router.route("/registerMail").post(mailer); // send the email
router.route("/authenticate").post(verifyUser ,(req, res) => res.end()); // authenticate user
router.route("/login").post(verifyUser, login); // login to app
// GET METHODS
router.route("/user/:username").get(getUser); // user with username
router.route("/generateOTP").get(verifyUser, localVariables, generateOTP); // generate random OTP
router.route("/verifyOTP").get(verifyUser, verifyOTP); // verify generated otp
router.route("/createResetSession").get(createResetSession); // reset all the variables

// Put method
router.route("/updateuser").put(Auth, updateUser); // is used to update the user profile
router.route("/resetPassword").put(verifyUser, resetPassword); // use to reset password
module.exports = router;
