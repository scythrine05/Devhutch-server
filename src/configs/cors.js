require("dotenv").config();

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [process.env.CLIENT_URL];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Allow the request
    } else {
      console.error(`Blocked by CORS: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type,Authorization",
};

module.exports = corsOptions;
