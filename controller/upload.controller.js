const fs = require('fs');
const unzipper = require('unzipper');
const util = require('util');
const parseString = require('xml2js').parseString;
const catchAsync = require('../utils/catchAsync');
const Document = require('../model/document.model');
const Segment = require('../model/segment.model');

const upload = catchAsync(async (req, res) => {
    // const docmentAsBytes = await fs.promises.readFile(req.file.path);

    // // Load your PDFDocument
    // const pdfDoc = await PDFDocument.load(docmentAsBytes);

    // const numberOfPages = pdfDoc.getPages().length;

    // for (let i = 0; i < numberOfPages; i++) {
    //     // Create a new "sub" document
    //     const subDocument = await PDFDocument.create();
    //     // copy the page at current index
    //     const [copiedPage] = await subDocument.copyPages(pdfDoc, [i]);
    //     subDocument.addPage(copiedPage);
    //     const pdfBytes = await subDocument.save();
    //     await writePdfBytesToFile(`file-${i + 1}.pdf`, pdfBytes);
    // }

    // async function writePdfBytesToFile(fileName, pdfBytes) {
    //     return fs.promises.writeFile(fileName, pdfBytes);
    // }

    const uploadFilename = req.file.filename.split('.zip')[0];
    await fs
        .createReadStream(req.file.path)
        .pipe(unzipper.Extract({ path: `uploads/${uploadFilename}` }))
        .promise();

    const data = fs.readFileSync(
        `uploads/${uploadFilename}/word/document.xml`,
        {
            encoding: 'utf8',
            flag: 'r',
        }
    );

    const pages = fs
        .readFileSync(`uploads/${uploadFilename}/docProps/app.xml`, {
            encoding: 'utf8',
            flag: 'r',
        })
        .split('<Pages>')[1]
        .split('</Pages>')[0];
    const document = await Document.create({
        filename: uploadFilename,
        ext: 'docx',
        path: req.file.path,
        pages,
    });

    const result = await util.promisify(parseString)(data);
    result['w:document']['w:body'][0]['w:p'].forEach((p) => {
        if (p['w:r']) {
            p['w:r'].forEach(async (r) => {
                let text = null;
                let bold = false;
                let italic = false;
                let strike = false;
                let underline = false;

                if (r['w:t']) {
                    if (r['w:t'][0]['_']) {
                        text = r['w:t'][0]['_'];
                    } else if (r['w:t'][0]['$']) {
                        text = null;
                    } else {
                        text = r['w:t'][0];
                    }
                }
                if (text) {
                    if (r['w:rPr']) {
                        if (r['w:rPr'][0]['w:b']) bold = true;
                        if (r['w:rPr'][0]['w:i']) italic = true;
                        if (r['w:rPr'][0]['w:u']) underline = true;
                        if (r['w:rPr'][0]['w:strike']) strike = true;
                        const segment = await Segment.create({
                            document_id: document.id,
                            text,
                            bold,
                            italic,
                            underline,
                            strike,
                        });
                        console.log(segment);
                    }
                }
            });
            // console.log(segment['w:r'][0]['w:t']);
        }
    });

    res.status(200).json({ status: 'success' });
});

module.exports = upload;
