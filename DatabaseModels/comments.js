const mongoose=require('mongoose')

let commentSchema=mongoose.Schema({
    blogs:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"blogs"
    },
    comment:{
        type:String
    }
})


module.exports=mongoose.model("commentSchema",commentSchema);