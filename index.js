const express = require('express')
const app = express()
const methodOveride = require('method-override')
const path = require('path')
const ejsMate = require('ejs-mate')
const flash = require('connect-flash')
const session = require('express-session')
const mongoose = require('mongoose')
const ExpressError = require('./views/utilities/ExpressError')
const tailwind = require('tailwindcss')
const axios = require('axios')
const fs = require("fs");
const Contacts = require('./model/appoiment')
// Replace with your Namecheap API credentials
const apiKey = 'cb839aa178c341898fd81c36924005a9';
const userName = 'zlivehe55';
const apiEndpoint = 'https://api.namecheap.com/xml.response';
const nodemailer = require('nodemailer');

// const homeRoute = require('./routes/homeRoutes')

const sessionConfig = {
    secret :'thisshouldbebetter',
    resave:false,
    saveUninitialized:true,
    cookie:{
    httpOnly:true,
    expires: Date.now() + 100 * 60 * 60 * 24 * 7,
    maxAge: 200 * 60 * 60 * 24 * 7
    }
 }


 dbUrl = 'mongodb+srv://zlivhe:pVGMDmaGmxRCenYU@gukari.w3j3o1v.mongodb.net/'
 mongoose.connect(dbUrl, 
 {useNewUrlParser: true,
 useUnifiedTopology: true})
 
 .then(()=>{
    console.log('open')
 })
 .catch(err =>{
    console.log("Oh no")
    console.log(err)
 });
 
app.set('views engine','ejs')
app.set('views', path.join(__dirname, 'views')); 
app.engine('ejs',ejsMate)
app.use(express.json());

app.use(methodOveride('_method'))
app.use(express.static('layouts'))
app.use(express.static('js'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({extended: true}))
app.use(session(sessionConfig))
app.use(flash())

// app.use('/',homeRoute)

 app.use((req, res, next) => {   
    const routes =  req.route
    res.locals.currentUser = req.session.user
   //  console.log(req.session)
    next();
 })
 


 app.get('/',(req,res)=>{
    res.render('view/index.ejs')
 })
 app.get('/index.html',(req,res)=>{
  res.render('view/index.ejs')
})
 app.get('/about-us/index.html',(req,res) =>{
   res.render('view/aboutus.ejs')

 })
 app.get('/our-services/index.html',(req,res) =>{
   res.render('view/ourservice.ejs')

 })
 app.get('/contact-us/index.html',(req,res) =>{
  res.render('view/contactus.ejs')

})
 app.get('/index-2',(req,res) =>{
   res.render('view/index-2.ejs')

 })
 
 app.get('/home-care-service',(req,res) =>{
   res.render('view/home-care-service.ejs')

 })
 
 app.get('/working-for-us',(req,res) =>{
   res.render('view/working-for-us.ejs')

 })
 app.get('/healthcare-staffing-services',(req,res) =>{
   res.render('view/healthcare-staffing-services.ejs')

 })
 
 
app.get('/atom.xml', async (req, res) => {
   try {
     const currentDate = new Date().toISOString();
 
     // Generate the sitemap XML dynamically
     let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
     sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
 
     // Add URLs dynamically from your website
     sitemap += `<url>
       <loc>${baseUrl}/</loc>
       <lastmod>${currentDate}</lastmod>
       <priority>1.0</priority>
     </url>\n`;
     
     sitemap += '</urlset>';
 
     // Save the generated sitemap XML to a file
     const filePath = path.join(__dirname, 'public', 'sitemap.xml');
     fs.writeFileSync(filePath, sitemap, 'utf8');
      console.log(filePath)
     // Set the content type header and send the file as the response
     res.header('Content-Type', 'application/xml');
     res.sendFile(filePath);
   } catch (error) {
     console.error('Error generating sitemap:', error);
     res.status(500).send('Internal Server Error');
   }
 });

app.post('/contact',(req,res)=>{
   const body = req.body
   console.log(body)
     // Send an email to the user
  const transporter = nodemailer.createTransport({
   service: 'gmail', // e.g., 'Gmail' or use your email service
   auth: {
     user: 'earnitzreward@gmail.com',
     pass: 'hiug vama irlg bnrw',
   },
 });

 const mailOptions = {
   from: 'zlivehe55@email.com',
   to: body.email, // Assuming user.email is the recipient's email address
   subject: `New Contact Info for ${body.name}`,
   text: `<div></div>`,
 };

 transporter.sendMail(mailOptions, (error, info) => {
   if (error) {
     console.error('Error sending email: ' + error);
   } else {
     console.log('Email sent: ' + info.response);
   }
 });

   console.log(body)

})



// 404 page not found route
app.all('*', (req,res,next)=>{
   next(new ExpressError('Page Not Found', 404))
})
// error hadling 
 app.use((err, req, res, next) =>{
   const { statusCode = 500 } = err;
   if (!err.message) err.message = 'Oh No, Something Went Wrong!'
   res.status(statusCode).render('error.ejs', { err })
})
//server
app.listen(1000, () => {
    console.log('Serving on port 1000')
})

