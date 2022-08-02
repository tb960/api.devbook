require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`});
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const initMongoDB = require('./config/mongo');
const i18n = require('i18n');
const app = express();

// Setup express server port from ENV, default: 3000
const port = process.env.PORT || 3000 ;

// i18n
i18n.configure({
	locales: ['en', 'es', 'de'],
	directory: `${__dirname}/locales`,
	defaultLocale: 'en',
	objectNotation: true,
});
app.use(i18n.init);

app.use(express.json() );       // to support JSON-encoded bodies
app.use(express.urlencoded({     // to support URL-encoded bodies
	extended: true
}));
app.use(multer().none());       // to support multipart/form-data bodies

app.use(cors());


app.use('/', require('./app/routes/index'));
//app.use(logger);   //example to use a middleware


//error handling on listening on port
app.listen(port, ()=>{
	//console.log(`App listening on port ${port}`);
	if (process.env.NODE_ENV !== 'test') {
		// Prints initialization
		console.log('****************************');
		console.log('*    Starting Server');
		console.log(`*    Server Port: ${process.env.PORT || 3000}`);
		console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
		console.log(`*    Database: MongoDB`);
		//console.log(dbStatus);
	}
});

//app.listen(app.get('port'), '0.0.0.0');  //need error handling and console log on this one

initMongoDB();



//i need protected route and unprotected route how to separate



// deleted code/ refactored code
// const mongoose = require('mongoose');

//const logger = require('./app/middleware/myLoger');  //example to use a middleware
// const connectDB = async () => {
//   try {
//     const conn = await mongoose.connect('mongodb://127.0.0.1:27017/DevBook',
//       {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//       }
//     );
//     console.log('MongoDB Connected:');
//     console.log(conn);
//   }
//   catch (error) {
//     console.log("Not Connected to Database ERROR! ", error);
//     //console.log(error)
//     process.exit(1)
//   }
// }

// connectDB();

// const conn = mongoose.connect('mongodb://127.0.0.1:27017/DevBook',
//   {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
//   }
// ).then(()=>{
//     console.log('Database connected')
// }).catch((err) => {
//     console.log("Not Connected to Database ERROR! ", err);
// });;
