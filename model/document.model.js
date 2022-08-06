const mongoose = require('mongoose');

const documentSchema = mongoose.Schema(
    {
        filename: {
            type: String,
            trim: true,
            required: true,
        },
        ext: {
            type: String,
            required: true,
        },
        path: {
            type: String,
            required: true,
        },
        pages: {
            type: Number,
        },
    },
    { timestamps: true }
);

const Document = mongoose.model('Document', documentSchema);

module.exports = Document;
