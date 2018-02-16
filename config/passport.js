var passport=require('passport');
var LocalStrategy=require('passport-local').Strategy;
var {User}=require('./../models/user');

passport.serializeUser(function(user,done){
  console.log(user);
  done(null,user.id);
});
passport.deserializeUser(function(id,done){
  User.findById(id,function(err,user){
    console.log(err);
    done(err,user);
  });
})

passport.use('local.signup',new LocalStrategy({
  usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
},(req,email,password,done)=>{

req.checkBody('email',"email is invalid").notEmpty().isEmail();
req.checkBody('password',"password is not invalid").notEmpty().isLength({min:4});
var errors=req.validationErrors();
if(errors){
  var message=[];
  errors.forEach(function(err){
    message.push(err.msg);
  });
  return done(null,false,req.flash('error',message));
}
User.findOne({email:email},function(err,user){
  if(err)
  {
    return done(err)
  }
  if(user){
    return done(null,false,{message:'already in use'});
  }
  var newUser=new User();
  newUser.email=email;
  newUser.password=newUser.encryptedPassword(password);
  newUser.save(function(err,result){
    if(err){
      return done(err);
    }
    return done(null,result,req.flash('success','you are successfully registerd'));
  });
})

}));



passport.use('local.signin',new LocalStrategy({
  usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
},(req,email,password,done)=>{

req.checkBody('email',"email is invalid").notEmpty().isEmail();
req.checkBody('password',"password is not invalid").notEmpty().isLength({min:4});
var errors=req.validationErrors();
if(errors){
  var message=[];
  errors.forEach(function(err){
    message.push(err.msg);
  });
  return done(null,false,req.flash('error',message));
}
User.findOne({email:email},function(err,user){
  if(err)
  {
    return done(err)
  }
  if(!user){
    return done(null,false,{message:'User not exists'});
  }

  if(!user.verifyPassword(password)){
    return done(null,false,{message:'wrong password'});
  }
  return done(null,user);
})

}));
