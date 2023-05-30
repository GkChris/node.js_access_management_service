const express = require('express');
var router = express.Router();

router.use('/temp', require('../controllers/TempController'));      

module.exports = router;