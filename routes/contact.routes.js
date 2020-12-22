const express = require("express");
const ContactController = require('../controllers/contact.controller');

const router = express.Router();

// router.get("/", (req, res) => {
//   res.json({contacts: 'Contacts'});
// });

router.get('/', ContactController.getContacts)

router.post('/', ContactController.createContacts)

module.exports = router;
