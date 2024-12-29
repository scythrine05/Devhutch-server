const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./src/routes");
const { port, corsOptions, connectDB } = require("./src/configs");

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => {
    app.use("/api", routes);

    server.listen(port, "0.0.0.0", () =>
      console.log("Server is listening on port: ", port)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to Database", err.message);
  });
