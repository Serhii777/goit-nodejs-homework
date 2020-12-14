const fs = require("fs");
const path = require("path");

const { promises: fsPromises } = fs;

const contactsPath = path.join(__dirname, "./db/contacts.json");

async function mainReadFile() {
  try {
    const contactsItem = await fsPromises.readFile(contactsPath, "utf-8");
    const contactsListJson = JSON.parse(contactsItem);
    return contactsListJson;
  } catch (error) {
    console.log(error);
  }
}

async function mainWriteFile(data) {
  try {
    const dataToJson = JSON.stringify(data);
    await fsPromises.writeFile(contactsPath, dataToJson);
  } catch (error) {
    console.log(error);
  }
}

//* Функции работы со списком

async function listContacts() {
  try {
    const contactsList = await mainReadFile();

    console.table(contactsList);
    console.log("This is list of all contacts!");
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const contactsList = await mainReadFile();
    const contactById = await contactsList.find(({ id }) => id === contactId);

    contactById
      ? (console.table(contactById), console.log("This contact found!"))
      : console.log("This contact did not found!");
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const contactsList = await mainReadFile();

    (await contactsList.find(({ id }) => id === contactId))
      ? ((contactRemove = contactsList.filter(({ id }) => id !== contactId)),
        await mainWriteFile(contactRemove),
        console.table(contactRemove),
        console.log("This contact was deleted successfully!"))
      : console.log("This contact did not found!");
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const contactsList = await mainReadFile();

    !(await contactsList.find((contact) => contact.name === name))
      ? ((id = contactsList.length + 1),
        (contactValue = { id, name, email, phone }),
        (contactsValue = [...contactsList, contactValue]),
        await mainWriteFile(contactsValue),
        console.table(contactValue),
        console.log("Contact was added into list of your contacts!"))
      : console.log("This contact is already existing!");
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};