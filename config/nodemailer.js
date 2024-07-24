const nodemailer = require('nodemailer');
require('dotenv').config();

const { USER, PASS } = process.env;

let transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: USER,
		pass: PASS,
	},
});

module.exports = transporter;
