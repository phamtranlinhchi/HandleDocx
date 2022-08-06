const mongoose = require('mongoose');

const segmentSchema = mongoose.Schema(
    {
        document_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Document',
        },
        text: {
            type: String,
            required: true,
        },
        bold: {
            type: Boolean,
            default: false,
        },
        underline: {
            type: Boolean,
            default: false,
        },
        strike: {
            type: Boolean,
            default: false,
        },
        italic: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Segment = mongoose.model('Segment', segmentSchema);

module.exports = Segment;
