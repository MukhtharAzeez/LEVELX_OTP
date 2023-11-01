const express = require('express')
const sessions = require('express-session');
const dotenv = require('dotenv')
const utils = require('./utils')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')


const app = express()
dotenv.config()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(
    sessions({
        secret: 'your-secret-key',
        resave: false,
        saveUninitialized: true,
    })
);

app.post('/send-otp', async (req, res) => {
    try {
        const { email, subject, text } = req.body
        let options = {
            email,
            subject,
            text
        }
        const status = await utils(options)
        if (status) res.status(200).json({ message: "Success" })
        else res.status(404).json({ message: "failed" })
    } catch (error) {
        res.json(404).status({message: "Something is wrong"})
        console.log("error",error)
    }
})

app.post('/save-otp', (req, res) => {
    try {
        req.session.otp = req.body.otp
        res.status(200).json({ message: "otp saved" })
    } catch (error) {
        res.status(404).json({message:"Something is wrong"})
    }
})

app.post('/verify-otp', (req, res) => {
    try {
        if (req.session.otp === req.body.otp) {
            const token = jwt.sign({ otp: req.body.otp }, 'secret-otp', { expiresIn: '10d' })
            if (!token) res.status(200).json({ message: "error while creating token" })
            else res.status(200).json({ token: token })
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