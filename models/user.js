const {Schema,model} = require('mongoose')

const userSchema = new Schema({
    email:{
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
    grades:{
        items:[{
            
            courseId:{
                type: Schema.Types.ObjectId,
                ref: "Course",
                required: false
            },
            completeness: {
                type: Number,
                required: false,
                default: 0.00001
            },
            integrity: {
                type: Number,
                required: false,
                default: 0.00001
            },
            skills: {
                type: Number,
                required: false,
                default: 0.00001
            }

        }]
    }

})

    module.exports = model('User',userSchema)