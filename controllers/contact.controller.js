const contacts = require("../db/contacts");

// console.log(contacts);

class ContactController {
  getContacts(req, res) {
    res.json(contacts);
    console.log("contacts:", contacts); //* contacts: [
    //     {
    //       id: 1,
    //       name: 'Alex',
    //       email: 'alex@gmail.com',
    //       phone: '067-956-45-32'
    //     },
    //     {
    //       name: 'Simon',
    //       email: 'simon@gmail.com',
    //       phone: '097-458-72-18',
    //       id: 2
    //     },
    //     {
    //       name: 'Elen',
    //       email: 'elen@gmail.com',
    //       phone: '098-355-68-77',
    //       id: 3
    //     }
    //   ]
  }

  createContacts(req, res, next) {
    const newContact = {
      ...req.body,
      id: contacts.length + 1,
    };

    contacts.push(newContact);

    return res.send();
  }
}

module.exports = new ContactController();
