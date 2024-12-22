require("dotenv").config();

const corsOptions = {
  origin: function (origin, callback) {
    if (origin === process.env.CLIENT_URL || !origin) {
      callback(null, true);
    } else {
      console.log(process.env.CLIENT_URL);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,   
};

module.exports = corsOptions;