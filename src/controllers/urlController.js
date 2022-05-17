const validator = require('validator')
const shortURL = require('node-url-shortener')

const urlModel = require('../models/urlModel')


const isValid = function (value) {
    if (typeof value === "undefined" || typeof value === null) return false
    if (typeof value === "string" && value.trim().length == 0) return false
    return true
}

const isValidRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
}

const postUrlShorten = async function (req, res) {
    try {

        let requestBody = req.body
        if (!isValidRequestBody(requestBody)) return res.status(400).send({ status: false, msg: 'Invalid Input.Provide URL.' })

        let { urlCode, longUrl, shortUrl } = requestBody

        if (!isValid(longUrl)) return res.status(400).send({ status: false, msg: 'Enter longUrl' })
        if (!validator.isURL(longUrl)) return res.status(400).send({ status: false, msg: `${longUrl} is not a valid url.` })

        let alreadyExistingUrl = await urlModel.findOne({ longUrl: longUrl })
        if (alreadyExistingUrl) return res.status(400).send({ status: false, msg: `${longUrl} already exists.` })


        shortURL.short(longUrl, async function (err, url) {
            if (err) return res.status(400).send({ status: false, msg: 'Error in shortening of url' })
            if (url) {
                shortUrl = url
                urlCode = url.slice(url.lastIndexOf('/') + 1)

                let creationData = {urlCode, longUrl, shortUrl}
                let newSortUrl = await urlModel.create(creationData)
                res.status(201).send({ status: true, data: newSortUrl })
            }
        });

    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}




module.exports = { postUrlShorten }