var express = require('express');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var bodyParser = require('body-parser');
var router = express.Router();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: true}));

router.use(fileUpload());

router.post('/upload', (req, res) => {
    let path = req.query.path;
    if (path === undefined) 
        path = '';
    
    let uploadFile = req.files.file;

    const fileName = req.files.file.name;
    uploadFile.mv(`os_apps/Files/home/${path + '/' + fileName}`, function (err) {
        if (err) {
            console.log(err);
            return res
                .status(500)
                .send(err)
        }
        console.log('uploaded file' + fileName + ' to ' + path);
        res.json('done');
    })
});

router.get('/', (req, res) => {
    let directory = req.query.directory;

    if (directory === undefined) 
        directory = '';
    
    let homePath = `os_apps/Files/home/${directory}/`;

    let userFiles = fs.readdirSync(homePath);
    let fileObjects = [];

    userFiles.forEach((file) => (fileObjects.push({
        name: file,
        birthtime: fs
            .lstatSync(homePath + file)
            .birthtime,
        isDirectory: fs
            .lstatSync(homePath + file)
            .isDirectory()
    })));

    console.log('providing files');
    res.send(fileObjects);
});

router.get('/download', (req, res) => {
    let path = req.query.path;
    console.log(path);
    if (path === undefined) {
        let err = new Error('No file was provided');
        console.log(err);
        res.send(err);
    } else 
        res.download(`os_apps/Files/home/${path}`);
    }
);

router.delete('/delete', (req, res) => {
    let path = req.body.path;
    console.log(path);
    let homePath = 'os_apps/Files/home';

    if (fs.lstatSync(homePath + path).isDirectory()) 
        fs.rmdir(homePath + path, (err) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else 
                res.send('done');
            }
        );
    else 
        fs.unlink(homePath + path, (err) => {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                console.log('deleted ' + homePath + path)
                res.send('done');
            }

        });
    }
);

// add renaming route

module.exports = router;