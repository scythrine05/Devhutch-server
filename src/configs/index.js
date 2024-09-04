const port = require("./port");
const firebase = require("./firebase");
const connectDB = require("./db");
const corsOptions = require("./cors");

module.exports = { port, firebase, corsOptions, connectDB };
