require('dotenv').config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connect = require("./database/conn");
const route = require("./router/route");
const app = express();

app.use(express.json());
app.use(cors({
  origin : 'https://mern-auth-jfvr.onrender.com'
}));
app.use(morgan("tiny"));
app.disable("x-powered-by");

const port = process.env.PORT || 8080;
app.get("/", (req, res) => {
    
  res.status(200).json("Home GET requested");
});

// api Routes
app.use('/api', route)

connect(process.env.MONGO_URI)
  .then(() => {
    try {
      app.listen(port, () => {
        console.log(`Server connected to port ${port}`);
      });
    } catch (err) {
      console.log("Cannot connect to the database");
    }
  })
  .catch((err) => {
    console.log("Invalid database connection");
  });
