const mongoose = require('mongoose')

const urlSchema = new mongoose.Schema({
    urlCode: {
        type: String,
        required: 'urlCode is mandatory',
        unique: true,
        lowercase: true,
        trim: true
    },
    longUrl: {
        type: String,
        required: 'longUrl is mandatory',
        trim: true
    },
    shortUrl: {
        type: String,
        required: 'shorturl is mandatory',
        unique: true
    }
}, { timestamps: true })


module.exports = mongoose.model('Url', urlSchema)//urls