const mongoose = require('mongoose');
require('dotenv').config();

const { MONGO_URI } = process.env;

const dbConnection = async () => {
	try {
		console.log('DATABASE was conected');
		return await mongoose.connect(MONGO_URI);
	} catch (error) {
		console.error(error);
		throw new Error('DATABASE connection was wrong');
	}
};

module.exports = {
	dbConnection,
};
