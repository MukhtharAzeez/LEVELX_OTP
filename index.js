const express = require('express')
// const cookieParser = require("cookie-parser");
const sessions = require('express-session');
const dotenv = require('dotenv')
const utils = require('./utils')
const bodyParser = require('body-parser')

const app = express()
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
dotenv.config()
app.use(sessions({
    secret: "secret",
    saveUninitialized: true,
    cookie: { maxAge: 1000*60*60 },
    resave: false
}));

app.post('/send-otp',async(req,res)=>{
    const {email, subject, message} = req.body
    let options = {
        email,
        subject,
        message
    }
    const status = await utils(options)
    if(status) res.status(200).json({message: "Success"})
    else res.status(404).json({message: "failed"})
})

app.get('/verify-otp',(req,res)=>{
    
})

app.listen(4000,()=>{
    console.log("Server running on Port 4000")
})