// const ContactsServer = require("./server");
const ContactServer = require("./server-mongoose");

new ContactServer().start();


//* Запуск: nodemon start