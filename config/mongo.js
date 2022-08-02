const mongoose = require('mongoose');
const DB_URL = process.env.MONGO_URI;

const initMongoDB = () => {
	const connectDB = async () => {
		let dbStatus = '';
		try {
			const conn = await mongoose.connect(
				DB_URL,
				{
					keepAlive: true,
					useNewUrlParser: true,
					useUnifiedTopology: true
				}
			);
			//no error
			dbStatus = `*    DB Connection: OK\n****************************\n`;
			console.log(dbStatus);

			// //process.env.NODE_ENV is passed either in travis.yml or package.json file
			// if (process.env.NODE_ENV !== 'test') {
			//     // Prints initialization
			//     console.log('****************************');
			//     console.log('*    Starting Server');
			//     console.log(`*    Port: ${process.env.PORT || 3000}`);
			//     console.log(`*    NODE_ENV: ${process.env.NODE_ENV}`);
			//     console.log(`*    Database: MongoDB`);
			//     console.log(dbStatus);
			// }
		}
		catch(error){
			dbStatus = `*    Error connecting to DB: ${error}\n****************************\n`;
			console.log(dbStatus);
			process.exit(1);
		}

		//extra setup
		// mongoose.set('useCreateIndex', true);
		// mongoose.set('useFindAndModify', false);
		// useNewUrlParser, useUnifiedTopology, useFindAndModify, and useCreateIndex are no longer supported options.
		// Mongoose 6 always behaves as if useNewUrlParser, useUnifiedTopology, and useCreateIndex are true,
		// and useFindAndModify is false. Please remove these options from your code.
	}

	connectDB();

	mongoose.connection.on('error', console.log);
	mongoose.connection.on('disconnected', connectDB);
}

module.exports = initMongoDB;


//todoList,
//create one utils to handle error
//create one utils to handle logging status
