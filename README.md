# auth-using-sequelize-and-nodejs
## JWT-token-Auth-using-Express-Nodejs-Mysql
Using JWT token for authorization and maintaining session in node js using express-session and MySql.

I edited some files in express so that I can add any object to "request", 
How to do this ? Here's the link I found on the web - 
https://truetocode.com/extend-express-request-and-response-typescript-declaration-merging/

#### SEQUELIZE MODELS


> ./models/user.js <br />
> ./models/admin.js
##### Description
- This is a JWT authentication demo app which is made using Sequelize to access Mysql database.

##### PROCESS
- (Registration) User enters the credentials to register, the password is hashed and stored in the database using sequelize driver.
   the user object is sent as json to the client side
- (LOGIN) When user enters the valid credentials, a token is generated having a validity period and sent to the client.
> validate_token()
- This middleware checks for validity of token and if it is expired then the user is logged out.

###### Routes
> app.get('/',validate_token,(req,res)=>{...})
- After successfully logged in the user will be redirected to this route
> app.get('/login',(req,res)=>{...})
- Login form is rendered
> app.post('/login',(req,res)=>{...})
- Login form data is sent to this route
> app.get('/register',(req,res)=>{...})
- Registration form is rendered
> app.post('/register',(req,res)=>{...})
- Email,username and password are sent to this route and a new user is created and returend in the browser in the form of json object