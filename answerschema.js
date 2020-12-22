const mongoose = require('mongoose')


const Schema = new mongoose.Schema({
	name:{
		type:String,
		required:true
	},
	image:{
		type:String,
		required:true
	},
	questiontype:{
		type:String,
		required:true
	},
	questiontypeid:{
		type:String,
		required:true

	},
	questionid:{
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

	}
})



module.exports = new mongoose.model("answer",Schema)







































