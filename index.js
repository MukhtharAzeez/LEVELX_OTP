const express = require('express')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const dotenv = require('dotenv')
const utils = require('./utils')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
dotenv.config()
app.use(
    sessions({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

app.post('/send-otp', async (req, res) => {
    try {
        const { email, subject, message } = req.body
        let options = {
            email,
            subject,
            message
        }
        const status = await utils(options)
        if (status) res.status(200).json({ message: "Success" })
        else res.status(404).json({ message: "failed" })
    } catch (error) {
        console.log("error",error)
    }
})

app.post('/save-otp', (req, res) => {
    req.session.otp = req.body.otp
    res.status(200).json({ message: "otp saved" })
})

app.post('/verify-otp', (req, res) => {
    try {
        if (req.session.otp === req.body.otp) {
            const token = jwt.sign({ otp: req.body.otp }, 'secret-otp', { expiresIn: '10d' })
            if (!token) res.json({ message: "error while creating token" })
            else res.json({ token: token })
        } else {
            res.json({ message: "Otp is not valid" })
        }
    } catch (error) {
        res.json({ message: "something went wrong" })
    }
})

app.listen(4000, () => {
    console.log("Server running on Port 4000")
})