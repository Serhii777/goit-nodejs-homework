const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const contactRouter = require("./contacts/contact.router");

require("dotenv").config();

module.exports = class ContactsServer {
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
    this.server.use(cors({ origin: "http://localhost: 3000" }));
  }

  initRoutes() {
    this.server.use("./contacts", contactRouter);
  }

  async initDatabase() {
    await mongoose.connect(process.env.MONGODB_URL);
  }

  startListening(){
    const PORT = process.env.PORT;
    
    this.server.listen(PORT, ()=>{
      console.log("Server listening on port:", PORT);
    })
  }
}
