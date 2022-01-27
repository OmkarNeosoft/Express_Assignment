const PORT = 8800;
const express = require('express')
const fs = require('fs')
let session = require('express-session')
const { render } = require('ejs')
const app = express()
const sessionTime = 1000 * 60 * 60 * 24
app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'abcdefghijklmnopqrstuvwxyz',
    saveUninitialized: true,
    cookie: { maxAge: sessionTime },
    resave: false
}))

app.get("/", (req, res) => {
    if (session.email === '') {
        res.redirect('/dashboard')
    }
    else {
        res.redirect("/login")
    }
})

app.get("/login", (req, res) => {
    res.render('index')
})

app.post("/", (req, res) => {
    let data = fs.readFileSync('data.json').toString()
    data = JSON.parse(data)
    let temp = data.filter(ele => ele.email === req.body.email)
    if (temp.length != 0) {
        if (req.body.email === temp[0].email && req.body.password === temp[0].password) {
            session = req.session
            session.email = req.body.email
            res.redirect("/dashboard")
        }
        else {
            res.redirect('/login')
        }
    }
    else {
        res.render("/login")
    }
})

app.get("/dashboard", (req, res) => {
    res.render('dashboard', { email: session.email })
})
app.get("/logout", (req, res) => {
    req.session.destroy()
    res.redirect("/login")
})

app.listen(PORT, (err) => { if (err) throw err; console.log(`Server running on ${PORT}`) })