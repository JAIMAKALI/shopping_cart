var express = require('express');
var router = express.Router();
var csrf=require('csurf');
var passport=require('passport');
var csrfProtection=csrf();
var Cart=require('./../models/shopping_list');
var {Order}=require('./../models/order');


router.use(csrfProtection);// middleware for route protection

router.get('/profile',isLoggin,(req,res)=>{
  Order.find({user:req.user}).then((order)=>{
    var cart;
    order.forEach((items)=>{
       cart=new Cart(items.cart);
   items.items=cart.generateArr();
    })
    console.log(order);
    res.render('user/profile',{orders:order});
  }).catch((e)=>{
    console.log(e);
  });


});

router.get('/logout',isLoggin,(req,res,next)=>{
  req.logout();
  res.redirect('/');
})

// router.use('/',isNotLoggin,(req,res,next)=>{
//   next();
// })


router.get('/signin',(req,res)=>{
  var message=req.flash('error');

  res.render('user/signin',{csrfToken:req.csrfToken(),message:message});
});

router.post('/signin',passport.authenticate('local.signin',{
  //  successRedirect:'/user/profile',
   failureRedirect: '/user/signin',
   failureFlash:true
}),function(req,res,next){
  if(req.session.oldUrl){
    var oldUrl=req.session.oldUrl;

    req.session.oldUrl=null;
    res.redirect(`/shopping_cart${oldUrl}`);
  }
  else {
    res.redirect('/user/profile');
  }
});

router.get('/signup',(req,res)=>{
  var success=req.flash('success');

  var message=req.flash('error');
  res.render('user/signup',{csrfToken:req.csrfToken(),message:message,success:success});
});

router.post('/signup',passport.authenticate('local.signup',{
    successRedirect:'/user/signup',
   failureRedirect: '/user/signup',
   failureFlash:true
})
);



module.exports = router;

function isLoggin(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}

function isNotLoggin(req,res,next){
  if(!req.isAuthenticated()){
    return next();
  }
  res.redirect('/');
}
