var mongoose=require('mongoose');

var schema= new mongoose.Schema({
  user:{type: mongoose.Schema.Types.ObjectId, ref: 'user_details'},
  cart:{type:Object,required:true},
  address:{type:String,required:true},
  paymentId:{type:String,required:true},
  name:{type:String,required:true}
});

var Order=mongoose.model('Order',schema);

module.exports={Order};
