const express=require('express')
const userBlogs=require('../DatabaseModels/blogs')
// const newComment=require('../DatabaseModels/comments')
const newUser=require('../DatabaseModels/user')
const blogImage=require('../DatabaseModels/BlogImage')
// const check=require('../DatabaseModels/check')
const{body,validationResult}=require("express-validator")
const router=express.Router()
const jwt=require('jsonwebtoken')
const multer = require('multer')
// const { create } = require('../DatabaseModels/blogs')
// const uploads=multer({dest:'uploads/'})
const fs=require('fs')

const bgImage=new blogImage()
// const NewBlog=new userBlogs()
// const newcom=new newComment()
//Get all the user specific blog
router.get('/getalluserSpecificBlogs',(req,res,next)=>{
    const AUTHtoken=req.header('auth-token')

    if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
    const verify=jwt.verify(AUTHtoken,'45jh$')
    req.user=verify.user
    next()
}catch(err){
     res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{

      let allBlogs=await userBlogs.find({user:req.user.id})
      res.send(allBlogs)
})

//Get all the specific blog except the logined user
router.get('/getallblogs',(req,res,next)=>{
  const AUTHtoken=req.header('auth-token')

  if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
  const verify=jwt.verify(AUTHtoken,'45jh$')
  req.user=verify.user
  next()
}catch(err){
   res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{
    let allBlogs=await userBlogs.find({user:{$nin:[req.user.id]}})

    

    res.send(allBlogs)
})


//compose new blogs
router.post('/addBlogs',(req,res,next)=>{
    const AUTHtoken=req.header('auth-token')

    if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
    const verify=jwt.verify(AUTHtoken,'45jh$')
    req.user=verify.user
    next()
}catch(err){
     res.send("plz authenticate with a valid token ")
}
},[body("title","Yr title must be 3 characters long").isLength({min:5}),
body("description","Your must elaborate your title in at least 20 words").isLength({min:8})
],async (req,res)=>{
    //    let allBlogs=await userBlogs.findById(req.user.id)
    //   let allBlogs=await userBlogs.find({user:req.user.id})
    //   res.send(allBlogs)
// console.log(req.user.id)
const errors=validationResult(req)
if(!errors.isEmpty()){
return res.status(400).send({error:errors.message})
}
let allusers=await newUser.find({_id:{$in:[req.user.id]}})
console.log("all blogs",allusers)
const NewBlog=new userBlogs()
    NewBlog.title=req.body.title,
    NewBlog.description=req.body.description,
    NewBlog.user=req.user.id,
    NewBlog.author=allusers[0].username
    NewBlog.imageUrl=bgImage.img
    NewBlog.category=req.body.category
    NewBlog.save()

// bgImage.blogs=NewBlog.id;
console.log(NewBlog)

// newcom.blogs=NewBlog.id;
// console.log("comme",newcom)

res.send(NewBlog)

})

//get username
router.get('/getusername',(req,res,next)=>{
  const AUTHtoken=req.header('auth-token')

  if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
  const verify=jwt.verify(AUTHtoken,'45jh$')
  req.user=verify.user
  next()
}catch(err){
   res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{
    console.log(req.user.id)
    let allBlogs=await newUser.find({_id:req.user.id})
    res.json(allBlogs[0].username)
})




//Get all the specific blog except the logined user
router.get('/getallblogs',(req,res,next)=>{
const AUTHtoken=req.header('auth-token')

if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
const verify=jwt.verify(AUTHtoken,'45jh$')
req.user=verify.user
next()
}catch(err){
 res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{
  let allBlogs=await userBlogs.find({user:{$nin:[req.user.id]}})

  

  res.send(allBlogs)
})

//update an existing blogs
router.put('/updateBlog/:id',(req,res,next)=>{
    const AUTHtoken=req.header('auth-token')

    if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
    const verify=jwt.verify(AUTHtoken,'45jh$')
    req.user=verify.user
    next()
}catch(err){
     res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{

updateBlog={}
if(req.body.title){
  updateBlog.title=req.body.title
}
if(req.body.description){
    updateBlog.description=req.body.description
}

if(bgImage.img){
  console.log("hell",bgImage.img)
  updateBlog.imageUrl=bgImage.img
}
if(req.body.category){
  updateBlog.category=req.body.category
}

let blogs=await userBlogs.findById(req.params.id)
// console.log("Here to string", blogs.user.toString())
if(!blogs){
   res.status(404).send({errors:"Not found"})
}
if( blogs.user.toString()!=req.user.id){
   res.status(404).send({errors:"auth not found"})
}

updateBlog=await userBlogs.findByIdAndUpdate(req.params.id,{$set:updateBlog},{new:true})
res.send(updateBlog)

})

//delete an existing blogs
router.delete('/deleteBlog/:id',(req,res,next)=>{
    const AUTHtoken=req.header('auth-token')
    if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
    const verify=jwt.verify(AUTHtoken,'45jh$')
    req.user=verify.user
    next()
}catch(err){
     res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{

let blogs=await userBlogs.findById(req.params.id)
// console.log("Here to string", blogs.user.toString())
if(!blogs){
   res.status(404).send({errors:"Not found"})
}
if( blogs.user.toString()!=req.user.id){
   res.status(404).send({errors:"auth not found"})
}

updateBlog=await userBlogs.findByIdAndDelete(req.params.id)
console.log(updateBlog)
res.send(updateBlog)

})

//adding comments 
router.put('/addcomment/:id',(req,res,next)=>{
  const AUTHtoken=req.header('auth-token')

  if(!AUTHtoken) return res.status(400).send("Plz login with valid token")
try{
  const verify=jwt.verify(AUTHtoken,'45jh$')
  req.user=verify.user
  next()
}catch(err){
   res.send("plz authenticate with a valid token ")
}
},async (req,res)=>{

const errors=validationResult(req)
if(!errors.isEmpty()){
return res.status(400).send({error:errors.message})
}
let reqBlog=await userBlogs.find({_id:{$in:req.params.id}})
let usR=await newUser.find({_id:req.user.id})
reqBlog[0].comments.push({comment:req.body.comments,author:usR[0].username,date:new Date(Date.now()).toGMTString()})
// reqBlog[0].commentAuthor=usR[0].username
console.log(reqBlog[0])
updateBlog=await userBlogs.findByIdAndUpdate(req.params.id,{$set:reqBlog[0]},{new:true})

// let comments=await newComment.create({
//   blogs:req.params.id,
//   comment:req.body.comment
// })

// reqBlog.save()
res.json(updateBlog)
})

//fetching all comments 
router.get('/fetchComments/:id',async (req,res)=>{
let reqComments=await userBlogs.find({_id:{$in:req.params.id}})
res.json(reqComments[0].comments)
})




////////////////////////////////////////
const path=require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
    //   cb(null, './uploads/');
    // cb(null, path.join(__dirname, '/uploads/'));
    // cb(null, __dirname);
    cb(null, '../Backend/uploads/');
    // fs.mkdir('uploads/',(err)=>{
    //  });
    },
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    }
  });
  
  const fileFilter = (req, file, cb) => {
    // reject a file
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  };

  const upload = multer({
    storage: storage,
    limits: {
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
  });

router.post('/uploadImage',upload.single("image"),async (req,res)=>{
    // bg=new blogImage;
    // res.send("jj")
    // let bg=await blogImage.create({
    //     data : fs.readFileSync(req.file.path),
    //     contentType : 'image/png'
    // })
   
    console.log(req.file)
    const url="http://localhost:5000/uploads/"+req.file.originalname;
    // let resp=await check.create({
    //     img:url
    // })
    bgImage.img=url;
    bgImage.save()
// // res.json({ message: 'New image added to the db!' });
// console.log(req)
// res.send(resp)

res.json(bgImage)
})

// const multer = require("multer");
// const path = require("path");
// const fs = require('fs');

// const storage = multer.diskStorage({
//     destination: function (req, res, cb) {
//         cb(null, 'uploads/')
//     }
//   });
    
//   const upload = multer({ storage: storage });
//   router.route('/img_data')
//   .post(upload.single('image'), function(req, res) {
//       var new_img = new blogImage;
//       new_img.img.data = fs.readFileSync(req.file.path)
//       new_img.img.contentType ='image/png'
//       new_img.save();
// //   res.json({ message: 'New image added to the db!' });
// res.send(new_img)

//   }).get(function(req, res) {
//       Img.findOne({}, 'img createdAt', function(err, img) {
//           if (err)
//               res.send(err);
//           res.contentType('json');
//           res.send(img);
//       }).sort({ createdAt: 'desc' });
//   });
  

module.exports=router