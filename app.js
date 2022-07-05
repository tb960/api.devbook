const express = require('express');
const mongoose = require('mongoose');

//const logger = require('./app/middleware/myLoger');  //example to use a middleware

mongoose.connect('mongodb://127.0.0.1:27017/DevBook',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
).then(()=>{
    console.log('Database connected');
}).catch((err) => {
    console.log("Not Connected to Database ERROR! ", err);
});;

const app = express();

const port = 3000;

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 


app.use('/', require('./app/routes/index'));
//app.use(logger);   //example to use a middleware

app.listen(port, ()=>{
    console.log(`App listening on port ${port}`);
});


//i need protected route and unprotected route how to separate