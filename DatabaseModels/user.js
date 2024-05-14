const mongoose=require('mongoose');

let Schema_of_user=mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
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
    confirm_password:{
        type:String,
        required:true
    }
});

let user=mongoose.model('user',Schema_of_user)
user.createIndexes();
module.exports=user;