require('dotenv').config();
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
    EMAIL : process.env.EMAIL,
    PASSWORD : process.env.PASSWORD
};
