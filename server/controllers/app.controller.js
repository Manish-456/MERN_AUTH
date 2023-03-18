const UserModel = require("../model/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const ENV = require("../config/config");
const optGenerator = require("otp-generator");

/** Middleware for verify user */
async function verifyUser(req, res, next) {
  try {
    const { username } = req.method === "GET" ? req.query : req.body;
    // check the user existance
    let exist = await UserModel.findOne({ username });
    if (!exist) return res.status(404).json({ error: "Can't find User!" });
    next();
  } catch (error) {
    return res.status(404).json({ error: "Authentication Error" });
  }
}
/**
 * POST : http://localhost:8080/api/register
 * @param {
 * "username" : "example123",
 * "password" : "admin123",
 * "email" : "example123@gmail.com",
 * "firstname" : "John",
 * "lastname" : "doe",
 * "mobile" : 981024545,
 * "address" : "Lisbon st-4, Portugal",
 *  "profile" : "https://res.cloudinary.com/kjlk.jpg"}
 *
 */

async function register(req, res) {
  const { username, password, email, profile } = req.body;
  // check the existing user
  const existUsername = await UserModel.findOne({ username }).exec();
  if (existUsername) {
    return res
      .status(400)
      .json({ error: "This username has already been taken" });
  }

  // check for existing email
  const existEmail = await UserModel.findOne({ email });
  if (existEmail) {
    return res
      .status(400)
      .json({ error: "User with this email already exists" });
  }
  // hash the password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // create a new user
  const newUser = new UserModel({
    username,
    password: hashedPassword,
    email,
    profile,
  });
  try {
    const savedUser = await newUser.save();
    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(500).json({ error });
  }
}
/**
 * POST :POST : http://localhost:8080/api/login
 * @param {
 * "username" : "example123",
 * "password" : "admin123",
 * }
 */
async function login(req, res) {
  const { username, password } = req.body;
  console.log(ENV);
  try {
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(401).json({ error: "Username not found" });
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Password does not match" });
    // create jwt token
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      ENV.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );
    return res.status(200).json({
      msg: "Login Successful..!",
      username: user.username,
      token,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
}

/** GET : http://localhost:8080/api/user/johndoe */
async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).json({ error: "Invalid username" });
    const user = await UserModel.findOne({ username }).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).send({ error: err });
  }
}

/** PUT: http://localhost:8080/api/updateuser/123
 *
 * @param {
 * "id" : <userId>}
 * @body {
 *  "firstname" : "",
 * "lastname" : "",
 * "profile" : ""
 * }
 */
async function updateUser(req, res) {
  const { userId } = req.user;
  if (!userId) return res.status(403).json({ error: "Forbidden" });
  try {
    const user = await UserModel.findById(userId);
    if (!user) return res.status(400).json({ error: "User not found" });
    await UserModel.findOneAndUpdate(
      { _id: user._id },
      { $set: req.body },
      { new: true }
    );

    return res.status(201).json({ message: "User updated" });
  } catch (err) {
    return res.status(500).send(err);
  }
}

/** GET : http://localhost:8080/api/generateOTP */
async function generateOTP(req, res) {
  try {
    req.app.locals.OTP = optGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });
   return res.status(201).json({ code: req.app.locals.OTP });
  } catch (err) {
    return res.status(500).json({ error: "Something went wrong" });
  }
}
/** GET : http://localhost:8080/api/verifyOTP */
async function verifyOTP(req, res) {
  const { code } = req.query;
  if (parseInt(req.app.locals.OTP) === parseInt(code)) {
    req.app.locals.OTP = null; // reset the OTP value
    req.app.locals.resetSession = true; // start session for reset Password
    return res.status(200).json({ message: "Verify Successfully" });
  }
  return res.status(400).json({ error: "Invalid OTP" });
}

// successfully redirect user when OTP is valid
/** GET : http://localhost:8080/api/createResetSession */
async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
  
    return res.status(201).json({flag :  req.app.locals.resetSession }); // allow access to this route only once
  }
  return res.status(404).send({ error: "Session expired" });
}

/** PUT : http://localhost:8080/api/resetPassword */
async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession) {
      return res.status(404).send({ error: "Session expired" });
    }
    try {
      const user = await UserModel.findOne({ username: req.body.username });
      if (!user) return res.status(404).json("User not found");
      
      const salt = await bcrypt.genSalt(10);
      req.body.password = await bcrypt.hash(req.body.password, salt);
      await UserModel.findOneAndUpdate(
        { username: user.username },
        { $set: { password: req.body.password } },
        { new: true }
      );
      req.app.locals.resetSession = false;
      return res.status(201).json({ msg: "Record updated" });
    } catch (error) {
      return res.status(500).json({ error: "Something went wrong" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
}

module.exports = {
  register,
  login,
  getUser,
  updateUser,
  generateOTP,
  verifyOTP,
  createResetSession,
  resetPassword,
  verifyUser,
};
