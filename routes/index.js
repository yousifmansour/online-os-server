var express = require('express');
var router = express.Router();
var systemRoutes = require('./systemRoutes');
var diaryRoutes = require('./os_apps/diaryRoutes');
var notesRoutes = require('./os_apps/notesRoutes');
var filesRoutes = require('./os_apps/filesRoutes');

// import all routes and use them
router.use('/', systemRoutes);
router.use('/diaries', diaryRoutes);
router.use('/notes', notesRoutes);
router.use('/files', filesRoutes);

module.exports = router;
