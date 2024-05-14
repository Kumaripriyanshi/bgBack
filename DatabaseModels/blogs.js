const mongoose=require('mongoose')


let Blogschema=mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    author:{
        type:String,
        default:"Unknown"
    },imageUrl:{
        type:String,
        default:"http://localhost:5000/uploads/t2.png"
    },
    comments:{
        type:[{}]
    },
    category:{
        type:String,
        default:"all"
    }
   
})

module.exports=mongoose.model('BlogsSchema',Blogschema)