const { Schema, model } = require('mongoose')

const course = new Schema({
	title: {
		type: String,
		required: true
	},
	description: {
		type: String,
		required: false
	},
	theory: {
		type: String,
		required: false
	},

	image: String,
	tasks: {
		tickets: [{
			question: {
				type: String,
				required: false
			},
			answer: {
				type: String,
				require: false
			},
			quess1: {
				type: String,
				require: false
			},
			quess2: {
				type: String,
				require: false
			},
			quess3: {
				type: String,
				require: false
			}
		}]
	}

})

module.exports = model('Course', course)
