var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var ImgSchema = new Schema({
    // blogs:{
    //     type:mongoose.Schema.Types.ObjectId,
    //     ref:"blogs"
    // },
    img: {type:String}
}, {
    timestamps: true
});
module.exports = mongoose.model('Img', ImgSchema);