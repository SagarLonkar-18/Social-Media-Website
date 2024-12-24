const express = require('express');
const {signin} = require('./controllers/user-controller');

const router = express.Router();

// post request because we are sending some data in req.body by the user
router.post('/signin',signin);

module.exports = router;