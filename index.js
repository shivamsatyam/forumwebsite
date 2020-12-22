const express = require('express')
const app = express()
const path = require('path')
const port = process.env.PORT || 3000
const bcrypt = require('bcryptjs')
const multer = require('multer')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const Html5Entities = require('html-entities').Html5Entities
const main = require('./app.js')

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))
const static_path = path.join(__dirname,'public')
app.use(express.static(static_path))


app.get('/',main)


app.get('/signup',main)

app.get('/login',(req,res)=>{
	res.render('login')
})

app.get('/threads/:token/:pageno',main)
app.get('/show/:id',main)

app.post('/signup',main)
app.post('/login',main)
app.post('/threads/:token/:pageno',main)
app.post('/answer/:id',main)
app.get('/answer/:id',main)
app.get('/answershow/:id/:token',main)

app.listen(port,(err)=>{
	console.log('the process has been listen')

})









































