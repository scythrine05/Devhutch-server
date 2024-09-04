const express = require("express");
const app = express();
const server = require("http").createServer(app);
const cors = require("cors");
const cookieParser = require("cookie-parser");

const routes = require("./src/routes");
const { port, corsOptions, connectDB } = require("./src/configs");

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());

connectDB()
  .then(() => {
    app.use("/api", routes);

    server.listen(port, () =>
      console.log("Server is listening on port: ", port)
    );
  })
  .catch((err) => {
    console.error("Failed to connect to Database", err.message);
  });
