const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
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
    this.server.use("/contacts", contactRouter);
  }

  async initDatabase() {
    try {
      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
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
      console.log("Server started listening on potr2", PORT);
    });
  }
};




//* Username: admin
//* Password: adminPassword
//* Connection string:
//* mongodb+srv://admin:<password>@homeworkdb.sxdff.mongodb.net/<dbname>?retryWrites=true&w=majority
//* mongodb+srv://admin:adminPassword@homeworkdb.sxdff.mongodb.net/db-contacts?retryWrites=true&w=majority
