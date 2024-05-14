const express=require('express');
const newUser=require('../DatabaseModels/user')
const router=express.Router()
const {body,validationResult}=require('express-validator')
const bcryptjs=require('bcryptjs')
const jwt=require('jsonwebtoken')


//ENDPOINTS :1    sneding request in this endpoint will create a new user and will send an auth token as an response
router.post('/createUser',[
    body('username','Enter a valid username').isLength({min:3}),
    body('email','Enter a valid e-mail').isEmail(),
    body('password','Enter a valid Password').isLength({min:8}),
    body('confirm_password','Not Matching!!').isLength({min:8})
], async (req,res)=>{

const errors=validationResult(req);
if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()});
}

const passerrros=req.body.password!==req.body.confirm_password?true:false
if(passerrros){
  return  res.status(404).json({errors:"Enter valid password ,since they don't match"});
}

// const exixtence_of_user=await newUser.findOne({email:req.body.email})   TODO

let salt=await bcryptjs.genSalt(10);
let newPASS=await bcryptjs.hash(req.body.password,salt);

try{
user=await newUser.create({
    username:req.body.username,
    email:req.body.email,
    password:newPASS,
    confirm_password:newPASS
})
let tokenData={
    user:{
        id:user.id
    }
}
console.log("user id=",user.id)

let AUTHtoken=jwt.sign(tokenData,'45jh$')

res.json(AUTHtoken)
}catch(err){
    res.send("A user with this email and username already exists")
}
})

//ENDPOINTS :2    sending request in this endpoint will login the user

router.post('/login',[
    body('username','Enter a valid username').exists(),
    body('password','Enter a valid Password').exists()
], async (req,res)=>{

const errors=validationResult(req);
if(!errors.isEmpty()){
   return res.status(400).json({errors:errors.array()});
}


const exixtence_of_user=await newUser.findOne({username:req.body.username})   
if(!exixtence_of_user){
    return res.status(400).json({errors:"Enter proper credentials "})
}

let passCheck=await bcryptjs.compare(req.body.password,exixtence_of_user.password)
if(!passCheck){
   return  res.status(400).json({errors:"Enter proper credentials "})
}


try{
let tokenData={
    user:{
        id:exixtence_of_user.id
    }
}
console.log("existence =",exixtence_of_user.id)
let AUTHtoken=jwt.sign(tokenData,'45jh$')

res.json(AUTHtoken)
}catch(err){
    res.status(400).send("Internal Server Error")
}
})







module.exports = router ;