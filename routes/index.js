var express = require('express');
var router = express.Router();
var passport=require('passport');
var {products}=require('./../models/shop');
var {Order}=require('./../models/order');
var Cart=require('./../models/shopping_list');
/* GET home page. */



router.get('/', function(req, res, next) {
  products.find().then((docs)=>{
    var chunck=[];
    var size=3;
    for (var i = 0; i < docs.length; i+=size) {
      chunck.push(docs.slice(i,i+size));
    }
    var successMsg=req.flash('success')[0];
      res.render('shop/index', { title: 'Express',products:chunck,successMsg:successMsg,noMsg:!successMsg });
  })
});

router.get('/add_to_shopping/:id',(req,res)=>{
  var productId=req.params.id;
  var cart=new Cart(req.session.cart?req.session.cart:{});

  products.findById(productId,function(err,product){
    if(err){
      console.log(err);
      return res.redirect('/');
    }
    cart.add(product,product.id);

    req.session.cart=cart;
    console.log(req.session.cart);
    res.redirect('/');
  })
})


router.get('/upcomingEvent',(req,res)=>{
  res.render('shop/upcomingevent');
});

router.get('/veg_near_me',(req,res)=>{
  res.render('location/car_location');
})

 module.exports = router;
