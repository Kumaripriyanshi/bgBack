var mongoose = require('mongoose')
var Schema = mongoose.Schema;
var Check = new Schema({
    img: {type:String}
});
module.exports = mongoose.model('check', Check);