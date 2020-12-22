const mongoose = require('mongoose')


const inputSchema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	},
	title:{
		type:String,
		required:true

	},
	description:{
		type:String,
		required:true

	},
	type:{
		type:String,
		required:true

	},
	typeid:{
		type:String,
		required:true

	}
	


})




module.exports =  new mongoose.model("question",inputSchema)

