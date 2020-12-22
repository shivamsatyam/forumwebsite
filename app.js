const express = require('express')
const path = require('path')
const bcrypt = require('bcryptjs')
const multer = require('multer')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const Html5Entities = require('html-entities').Html5Entities
const routes = express.Router()
const data = require('./json.js')
const threadschema = require('./threadschema.js')
const answerschema = require('./answerschema.js')

 routes.use(session({
 	secret:"shivam",
 	resave:false,
 	saveUninitialized:true,
 	store:new MongoStore({
 		url:'mongodb+srv://shivamsatyam:shivamsatyam123@cluster0.hrigk.mongodb.net/shivamforum?retryWrites=true&m=majority',
 		mongooseConnection:mongoose.connection,
 		ttl:14*24*60*60
 	})
 }))
 

mongoose.connect('mongodb+srv://shivamsatyam:shivamsatyam123@cluster0.hrigk.mongodb.net/shivamforum?retryWrites=true&m=majority',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{
	console.log('the connection is succesfully established')
}).catch((err)=>{
	console.log(err)
})




routes.get('/signup',(req,res)=>{
	console.log(req.session)
	res.render('signup')
})


routes.use(express.urlencoded({extended:false}))
const inputSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	}
	


})



const model = new mongoose.model("person",inputSchema)





const Storage = multer.diskStorage({
	destination:'./public/upload',
	filename:(req,file,cb)=>{
		cb(null,file.fieldname+"_"+Date.now()+path.extname(file.originalname))
	}
})

const upload = multer({
	storage:Storage
}).single('file')



const saving =  async(req,res)=>{
	// console.log(req.body)
	try{
		

		
			const hash = await bcrypt.hash(req.body.password,10)
			const newUser =  await new model({
				name:Html5Entities.encode(req.body.username),
				email:Html5Entities.encode(req.body.email),
				password:hash,
				image:req.file.filename


		})

			
		
			newUser.save((err,req)=>{
			if (err){ throw err}else{
					res.redirect("/login")		
			}

		
		})
		

		
	}
	catch(err){
		console.log('A exception occured '+err)
	}
}



routes.post('/signup',upload,(req,res,next)=>{
	saving(req,res)
})

routes.get('/',(req,res)=>{
	res.render('index',{data:req.session.name})
})

routes.post('/login',async(req,res)=>{
	try {
		const email = Html5Entities.encode(req.body.email);
		const password  = req.body.password;
		const userEmail =  await model.findOne({email:email})
		console.log(userEmail)
		if(bcrypt.compare(password,userEmail.password)){
			
			
			req.session.name = userEmail.name
			req.session.email = req.body.email
			req.session.image = userEmail.image
			res.redirect('/')

		}else{
			res.send("Password does not match")
		}
		// res.send(userEmail)

	} catch(e) {
		console.log(e);
		res.status(400).send("Invalid entry input")
	}
})




routes.get('/threads/:token/:pageno',(req,res)=>{
	console.log(typeof(req.session))
	console.log(typeof(data[req.params.token]))
	threadschema.find({typeid:req.params.token},(err,dataand)=>{
		if (err) throw err;
		console.log(dataand)
		dataand.forEach((e) => {
		  if(typeof(e.title)!=undefined){
		  		e.title = Html5Entities.decode(e.title)
		  }
		})

		if (dataand){
			 // dataand[0].title = Html5Entities.decode(dataand[0].title)
			res.render('threads',{datas:data[req.params.token-1],question:dataand})

		}else{
			res.render('threads',{datas:data[req.params.token-1]})

		}

	})
})

routes.post('/threads/:token/:pageno',async (req,res)=>{
	
	try{	
			if(req.session.name!=undefined){
				const token = req.params.token
				const pageno = req.params.pageno
				console.log(req.session)
				const newUser =  await new threadschema({
					name:Html5Entities.encode(req.session.name),
					image:req.session.image,
					title:Html5Entities.encode(req.body.title),
					description:Html5Entities.encode(req.body.desc),
					type:data[req.params.token-1].name,
					typeid:req.params.token
			})
			
			
				newUser.save((err,req)=>{
				if (err){ throw err}else{
						res.redirect(`/threads/${token}/:${pageno}`)		
				}

			
			})
			}else{
				res.redirect('/signup')
			}	
		
	
	}
	catch(err){
		console.log('A exception occured '+err)
}

})


routes.get('/show/:id',(req,res)=>{
	try {
		threadschema.find({_id:req.params.id},(err,datas)=>{
		console.log(data[1])
		// console.log(data)
		datas[0].description = Html5Entities.decode(datas[0].description)
		 res.render('showquestion',{datas:datas,typeid:data[datas[0].typeid-1].name})
	})

	} catch(e) {
		// statements
		console.log(e);
	}
})


routes.get('/answer/:id',(req,res)=>{
	try {
		if(req.session.name!=undefined){
			threadschema.find({_id:req.params.id},(err,datas)=>{
			// console.log(data[1])
			const id = req.params.id
			datas[0].title = Html5Entities.decode(datas[0].title)

			answerschema.find({questionid:req.params.id},(err,question_data)=>{
				question_data.forEach((item) => {
				  item.title = Html5Entities.decode(item.title)
				  item.description = Html5Entities.decode(item.description)
				})
			 res.render('question',{datas:datas,id:id,question_data:question_data})
		})
			})
				
		}else{
			res.redirect('/signup')
		}	
	} catch(e) {
		console.log(e);
	}
	
})

routes.get('/answershow/:id/:token',(req,res)=>{
	try {
		answerschema.find({_id:req.params.token,questionid:req.params.id},(err,data)=>{
		if (err){
			console.log('err')
		}
		data.forEach((e)=>{
			e.description = Html5Entities.decode(e.description)
		})
		res.render('showanswer',{datas:data})
	})
	} catch(e) {
		// statements
		console.log(e);
	}
})

routes.post('/answer/:id',(req,res)=>{

	try {
		if(req.session.name!=undefined){
	const id = req.params.id
	threadschema.findOne({_id:id},(err,data)=>{
		// console.log(data + '\n\n\n\n\n\n\n\n')
		if (err) throw err;
		const fullanswer = new answerschema({
			name:req.session.name,
			image:req.session.image,
			questiontype:data.type,
			questiontypeid:data.typeid,
			questionid:id,
			title:Html5Entities.encode(req.body.title),
			description:Html5Entities.encode(req.body.desc)
		})

		fullanswer.save((err,some_data)=>{
			if (err){
				throw err;
			}else{
				res.redirect(`/answer/${id}`)
			}
		})
	})
	
	}else{
		res.redirect('/signup')
	}

	
	} catch(e) {
		// statements
		console.log(e);
	}
})


module.exports = routes