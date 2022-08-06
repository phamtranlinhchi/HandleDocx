const express = require('express');
const app = express();
const port = 3000;
const logger = require('./config/logger');
const path = require('path');
const multer = require('multer');
const upload = require('./config/multer');
const PDFDocument = require('pdf-lib').PDFDocument;
const replaceExt = require('replace-ext');
const uploadDocument = require('./controller/upload.controller');

const connectToDB = require('./config/mongodb');
connectToDB();

// parse json request body
app.use(express.json());
// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

//view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('uploadSite');
});

app.post('/upload', upload.single('file'), uploadDocument);

app.listen(port, () => {
    logger.info(`Example app listening on port ${port}`);
});
