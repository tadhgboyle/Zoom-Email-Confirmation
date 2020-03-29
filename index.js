const jwt = require('jsonwebtoken')
const config = require('./config')
const rp = require('request-promise')
const express = require('express')
const app = express()
const replace = require('replace-in-file')
const fs = require('fs')
const nodemailer = require('nodemailer')

app.set('view engine', 'pug')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
var resp
const port = 3000

const payload = {
    iss: config.APIKey,
    exp: ((new Date()).getTime() + 5000)
}
const token = jwt.sign(payload, config.APISecret)

app.get('/', (req, res) => res.render('index'))

app.post('/meeting-info', (req, res) => {
    meeting = (req.body.meeting).replace('-', '')
    meeting = (meeting).replace('-', '')
    client_email = req.body.email

    var options = {
        uri: "https://api.zoom.us/v2/meetings/" + meeting,
        qs: {
            status: 'active'
        },
        auth: {
            'bearer': token
        },
        headers: {
            'User-Agent': 'Zoom-api-Jwt-Request',
            'content-type': 'application/json'
        },
        json: true
    }

    rp(options)
        .then(function (response) {
            resp = response
            res.render('meeting-info', {
                title: resp.topic,
                meeting_id: req.body.meeting,
                client_email: client_email,
                email: formatEmail(resp)
            })
        })
        .catch(function (err) {
            console.log('API call failed:', err)
            res.render('index', {
                error: err
            })
        })
})

app.post('/send-mail', (req, res) => {
    client_email = req.body.client_email
    email = req.body.email

    let transporter = nodemailer.createTransport({
        host: config.mail.host,
        port: config.mail.port,
        secure: config.mail.secure,
        auth: {
            user: config.mail.username,
            pass: config.mail.password
        }
    })
    let mailOptions = {
        from: config.mail.from,
        to: req.body.client_email,
        subject: config.mail.subject,
        text: req.body.email
    }
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.render('index', {
                success: 'Email Sent!'
            })
        }
    });
})

app.listen(port, () => console.log(`Listening on port ${port}...`))

function formatEmail(resp) {
    const options = {
        files: './email.txt',
        from: ['{time}', '{duration}', '{meeting_link}'],
        to: [resp.start_time, resp.duration, resp.join_url],
    }
    try {
        replace.sync(options)
        console.log('Edited email.txt...')
        const email = fs.readFileSync('email.txt', 'utf8')
        const resetting = {
            files: './email.txt',
            from: [resp.start_time, resp.duration, resp.join_url],
            to: ['{time}', '{duration}', '{meeting_link}'],
        }
        try {
            replace.sync(resetting)
            console.log('Reset email.txt...')
        }
        catch (error) {
            console.error('Error occurred while resetting email.txt...', error)
        }
        return email
    }
    catch (error) {
        console.error('Error occurred while editing email.txt...', error)
    }
}