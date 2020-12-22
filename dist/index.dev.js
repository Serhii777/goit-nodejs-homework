"use strict";

var yargs = require("yargs").argv;

var _require = require("./contacts"),
    listContacts = _require.listContacts,
    getContactById = _require.getContactById,
    removeContact = _require.removeContact,
    addContact = _require.addContact,
    sum = _require.sum;

var hello = "Hello world from index.js!!!";
console.log(hello); // console.log(yargs);

var contact = yargs.number("id").string("name").string("email").string("phone").alias("name", "n").alias("email", "e").alias("phone", "p").argv; // console.log(contact);
// const {action, id, name, email, phone} = argv
// TODO: рефакторить
// function invokeAction({ action, id, name, email, phone }) {
//   switch (action) {
//     case "list":
//       // ...
//       break;
//     case "get":
//       // ... id
//       break;
//     case "add":
//       // ... name email phone
//       break;
//     case "remove":
//       // ... id
//       break;
//     default:
//       console.warn("\x1B[31m Unknown action type!");
//   }
// }
// invokeAction(argv);

listContacts();
getContactById();
removeContact();
addContact();
sum(10, 50);