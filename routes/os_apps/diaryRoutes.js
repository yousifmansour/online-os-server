var fs = require('fs');
var express = require('express');
var router = express.Router();

router.get('/:week', (req, res) => {
    let week = req.params.week;
    let diary = fs
        .readFileSync('os_apps/Diary/' + week + '.html')
        .toString();
    res.send(diary);
});

router.get('/', (req, res) => {
    let diaries = fs.readdirSync('os_apps/Diary/');
    res.send(diaries);
});

module.exports = router;