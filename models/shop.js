var mongoose=require('mongoose');

var schema= new mongoose.Schema({
  imageUrl:{type:String},
  title:{type:String},
  description:{type:String},
  price:{type:Number}
});

var products=mongoose.model('benchfresh',schema);

module.exports={products};
