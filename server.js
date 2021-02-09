const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const sgMail = require("@sendgrid/mail");

require("dotenv").config();

const authRouter = require("./auth/auth.router");
const userRouter = require("./users/user.router");
const fileRouter = require("./files/file.router");
const contactRouter = require("./contacts/contact.router");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);


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
    this.server.use(express.static("./public"));
  }

  initRoutes() {
    this.server.use("/auth", authRouter);
    this.server.use("/users", userRouter);
    this.server.use("/contacts", contactRouter);
    this.server.use("/files", fileRouter);
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

//* npm run start

//* POST http://localhost:3000/auth/sign-up   // registeration new user
//* PUT http://localhost:3000/auth/sign-in    // login user
//* GET http://localhost:3000/auth/verify/:verificationToken  // verify Email user
//* PATCH http://localhost:3000/auth/logout   // logout user

//* GET http://localhost:3000/users            // get all users
//* GET http://localhost:3000/users/current    // get current user
//* PATCH http://localhost:3000/users/user     // update subscription
//* GET http://localhost:3000/users/id         // get user by ID
//* PUT http://localhost:3000/users/id         // update user by ID
//* DELETE http://localhost:3000/users/id      // delete user by ID

//* POST http://localhost:3000/files/upload    //* upload file
//* GET http://localhost:3000/files/images/94f0087b-5eb3-4ba8-91ab-0e0d5571667a.png //* download file
//* PATCH http://localhost:3000/users/avatars    // update avatar
