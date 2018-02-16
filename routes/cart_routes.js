var express = require('express');
var router = express.Router();
var passport=require('passport');
var {products}=require('./../models/shop');  //about all item display on the main page
var {Order}=require('./../models/order');  //all order will be store in database
var Cart=require('./../models/shopping_list'); //using session to store the adding cart on the session

//router for checking cart items and pay
router.get('/cart',(req,res)=>{
  if(!req.session.cart){
  return res.render('shop/cart',{product:null});}

  var cart=new Cart(req.session.cart);
  console.log(req.session.cart);
  res.render('shop/cart',{product:cart.generateArr(),totalQty:cart.totalQty,totalPrice:cart.totalPrice})

});

// when user click checkout then send it to payment daetails page and check if logged in or not the redirect to cart
router.get('/checkout',isLoggin,(req,res)=>{
  if(!req.session.cart){
    return res.redirect('/shopping_cart/cart');
  }
    var cart=new Cart(req.session.cart);
   res.render('shop/checkout',{total:cart.totalPrice});
})

//after submitting the card details and address checking Card process first excuted then send to post method
router.post('/checkout',isLoggin,(req,res)=>{
  //check if there is no cart in items
  if(!req.session.cart){
    return res.redirect('shopping_cart/cart');
  }
    var cart=new Cart(req.session.cart);
    // See your keys here: https://dashboard.stripe.com/account/apikeys
var stripe = require("stripe")("sk_test_4uuUIco3rJvydnVhvo4p3mZz");

// Token is created using Checkout or Elements!
// Get the payment token ID submitted by the form:
var token = req.body.stripeToken; // Using Express

// Charge the user's card:
stripe.charges.create({
  amount: cart.totalPrice,
  currency: "usd",
  description: "Example charge",
  source: token,
}, function(err, charge) {
  // asynchronously called
  if(err){
    req.flash('error',err.msg);
    res.redirect('/shopping_cart/checkout');
  }
  // store the cart in database of company
  var order=new Order({
    user:req.user,
    cart:cart,
    address:req.body.address,
    paymentId:charge.id,
    name:req.body.name
  });

  order.save(function(err,succ){
    if(err)
    {
      console.log('something bad happended');
    }
    req.session.cart=null;
    req.flash('success','you are successfully bought the coupon');
    res.redirect('/');
  });
//something
});

});

module.exports = router;
 //middeleware fo check the logging or not
function isLoggin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  req.session.oldUrl=req.url;
  res.redirect('/user/signin');
}
