const express = require('express'),
app = express(),
dotenv = require('dotenv'),
uuidv4 = require('uuid/v4');
dotenv.config();
const bodyParser = require('body-parser'),
config= require('./config.js'),
bcrypt = require('bcrypt'),
jwt = require('jsonwebtoken'),
cookieParser = require('cookie-parser'),
methodOverride = require('method-override'),
compression = require('compression'),
shouldCompress = (req, res) => {
    if (req.headers['x-no-compression']) {
      // don't compress responses if this request header is present
      return false;
    }
    // fallback to standard compression
    return compression.filter(req, res);
  };
  
//import models
const { User, Room, Admin } = require('./sequelize');

app.set('trust proxy', 1);
app.set('view engine','ejs');
app.use(compression({
    filter:shouldCompress,
    threshold: 3
}));
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));

app.use(require('express-session')({
    secret:'PeShVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x!A%D*G-KaPdSgUkXp2s5v8y/B?E(H', //cookie secret
    name: 'e_session',
    resave:false,
    path: 'session/',
    cookie: {sameSite: true,maxAge: 60000,httpOnly: true}, //max-age is in miliseconds
    saveUninitialized:false,
}));

app.use(methodOverride('_method'));
app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
});
app.disable('x-powered-by');

//REST APIs
app.get('/',validate_token,(req, res)=>{
    console.log(req.session.user_id);
    console.log(req.session.status);
    res.render('index'); 
});
//auth routes

app.get('/login',(req, res)=>{
    console.log("Session Active Status "+req.session.status);
    console.log("Session Active ID "+req.session.user_id);
    if(req.session.status){
       
        res.redirect('/');
    }
    else{
        
        res.render("login");
    }
});
app.post('/login',(req, res)=>{
    /* login the user */
    console.log("login post request");
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({
        where:{
            email: email
        }
    })
    .then(user=>{
        if(user){
            bcrypt.compare(password,user.password)
            .then(passwordMatch=>{
                if(passwordMatch){
                    //login success
                    const JWT = create_token(user.username,"60000");
                    console.log("login success");
                    res.cookie("jwt", JWT, {expire: 60000 + Date.now(),httpOnly: true,sameSite:true});
                    //managing session using express session, just using to check login status
                    console.log(user.dataValues.id)
                    req.session.user_id = user.dataValues.id;
                    req.session.status = true;
                    res.redirect('/');
                }
            })
        }else{
            res.send("No such user found!");
        }
    })
    .catch(err=>{
        res.send(err);
    });
});
app.get('/register',(req, res)=>{
    if(req.session.status) res.redirect('/');
    else
    res.render("register");
});
app.post('/register',(req, res)=>{
    /* create a new user */
    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    User.findOne({
        where: {email: email}
    })
    .then(user=>{
        if(user){
            res.send("Email already exists!");
        }else{
            const hash = bcrypt.hash(password,config.saltingRounds,(err, hashed)=>{
                if(err){
                    console.log("error hashing the password");
                }
                else{
                    const newUser = {
                        id: uuidv4(),
                        username: username,
                        email: email,
                        password: hashed
                    }
                    User.create(newUser).then(user => {
                        console.log("user's auto-generated ID:", user.id);
                        res.send(user);           
                    }).catch(err=>{
                        res.send({'err': 'Same username found!!'});
                    });
                }
            })
        }
    })
    .catch(err=>{
        res.send(err);
    });
});
app.get('/logout',validate_token,(req, res)=>{
    //clear all cookies
    res.clearCookie("jwt");
    req.session.destroy(function(err){
        if(err){
            console.log(err);
        } else {
            //destroy the session and redirect back to login page
            res.redirect('/login');
        }
    });
    
})
app.listen(process.env.PORT,(req, res)=>{
    console.log(`Server started at http://localhost:${process.env.PORT}`);
});

//middleware
function validate_token(req, res, next){
    const client_token = req.cookies.jwt;
    // console.log(client_token);
    jwt.verify(client_token, config.jwt_secret, (err, decoded)=>{
        if(err){
            console.log(err);
            console.log("Token Expired!!");
            res.clearCookie("jwt");
            res.redirect("/login");
        }else{
           // console.log(decoded);
            next();
        }
    });
 }
 function create_token(username,expiresIn){

    const payload = { user: username };
    const options = { expiresIn:expiresIn, issuer: 'AxDu' };
    const secret = config.jwt_secret;
    const token = jwt.sign(payload, secret, options);
    return token;

}