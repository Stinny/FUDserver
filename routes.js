const router = require('express').Router();
const controllers = require('./controllers');
const multer = require('multer');
const setUser = require('./middleware/setUser');

//multer config
const storage = multer.memoryStorage();
const uploadStorage = multer({ storage: storage }).array('digitalProducts');

router.get('/files', setUser, controllers.getFiles);

router.post('/upload', uploadStorage, controllers.uploadFile);

router.post('/create', setUser, controllers.createFile);

router.post('/delete', setUser, controllers.deleteFile);

router.post('/login', controllers.login);

router.post('/register', controllers.register);

module.exports = router;
