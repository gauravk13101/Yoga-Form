var express = require('express');
var app = express();
var parser = require('body-parser');

app.use(parser.urlencoded({ extended: false }))
app.use(parser.json())
// set the view engine to ejs
app.set('view engine', 'ejs');
app.use( express.static( "public" ) );
// use res.render to load up an ejs view file

require('dotenv').config()

const mysql = require('mysql2')

const connection = mysql.createConnection(process.env.DATABASE_URL)

console.log('Connected to PlanetScale!')

// index page
app.get('/', function(req, res) {
  res.render('pages/index');
});

//form fill
app.post('/customer/add', async (req,res)=>{
  customerDetails = {
    email : req.body.email , 
    fullName  : req.body.fullName , 
    age : Number(req.body.age) , 
    phoneNumber : req.body.phoneNumber , 
    batch : Number(req.body.batch)
  }
  console.log(customerDetails);
  let sql = `INSERT INTO CUSTOMERS(NAME , AGE , EMAIL , PNO , BNO ) VALUES( '${customerDetails.fullName}' ,'${customerDetails.age}','${customerDetails.email}' , '${customerDetails.phoneNumber}','${customerDetails.batch}')` ; 
  connection.query(sql , (err , results) => {
    if(err) throw err ; 
    console.log(results);
    let sql = `INSERT INTO PSTATUS VALUES ('${results.insertId}' , 1)`;
    connection.query(sql , (err , results) => {
      if(err) throw err ; 
      res.render('pages/payment') ;
    }) 
  });
  
})

app.get('/payment', function(req, res) {
  res.render('pages/payment');
});

app.post('/thankyou' , (req, res) => {
  res.render('pages/thankyou');
})


// batch change

app.get('/bchange' , (req,res) => {
  res.render('pages/bchange');
})
app.post('/bchange' , (req,res) => {
  let sql = `SELECT * FROM CUSTOMERS WHERE ID = ${req.body.id} AND PNO = ${req.body.phoneNumber}` ;
  connection.query(sql , (err , results) => {
    if(err) throw err ; 
    if(results.length == 0 )
     res.render('pages/bchange');
    console.log(results[0].BNO);
    sql = `INSERT INTO BATCH_CHANGE VALUES( '${req.body.id}' , '${results[0].BNO}' , '${req.body.batch}')`;
    connection.query(sql , (err , results) => {
      if(err) throw err ; 
      res.render('pages/index');
    })
  })
  
})
app.listen(8080);
console.log('Server is listening on port 8080');