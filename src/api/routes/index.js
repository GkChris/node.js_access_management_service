const express = require('express');
var router = express.Router();

/*** Special route that contain endpoints to initialize and drop the database ***/
router.use('/database', require('../controllers/DatabaseController'));      

/* Routes */
router.use('/users', require('../controllers/UserController'));      
router.use('/sessions', require('../controllers/SessionController'));      
router.use('/roles', require('../controllers/RoleController'));      
router.use('/realms', require('../controllers/RealmController'));      
router.use('/clients', require('../controllers/ClientController'));      
router.use('/permissions', require('../controllers/PermissionController'));      

module.exports = router;