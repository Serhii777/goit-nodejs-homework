const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRouter = require("./users/auth.router");
const userRouter = require("./users/user.router");
const contactRouter = require("./contacts/contact.router");

require("dotenv").config();

module.exports = class ContactServer {
  constructor() {
    this.server = null;
  }

  async start() {
    this.initServer();
    this.initMiddleware();
    this.initRoutes();
    await this.initDatabase();
    this.startListening();
  }

  initServer() {
    this.server = express();
  }

  initMiddleware() {
    this.server.use(express.json());
    this.server.use(cors({ origin: "http://localhost:3000" }));
  }

  initRoutes() {
    this.server.use("/auth", authRouter);
    this.server.use("/users", userRouter);
    this.server.use("/contacts", contactRouter);
  }

  async initDatabase() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
      };

      await mongoose.connect(process.env.MONGODB_URL, options);
      console.log("Database connection successful");
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }

  startListening() {
    const PORT = process.env.PORT;

    this.server.listen(PORT, () => {
      console.log("Server started listening on potr", PORT);
    });
  }
};
