const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const transporter = require('../config/nodemailer.js');
require('dotenv').config();
const API_URL = process.env.API_URL;
const JWT_SECRET = process.env.JWT_SECRET;

const User = require('../models/User');
const Image = require('../models/Image');

const UserController = {
	async createUser(req, res) {
		try {
			const password = await bcrypt.hash(req.body.password, 10);
			const user = await User.create({
				...req.body,
				password,
				image_path: req.file != undefined || null ? req.file.filename : 'nonUserImage',
			});
			const emailToken = jwt.sign({ email: req.body.email }, JWT_SECRET, { expiresIn: '48h' });
			const url = API_URL + '/users/confirm/' + emailToken;
			await transporter.sendMail({
				to: req.body.email,
				subject: 'Please confirm your email.',
				html: `<h3> Welcome to ResiAdmin. Please confirm your email.</h3>
                    <a href=${url}>Click to confirm your email</a>`,
			});
			res.status(201).send({ msg: `The user's email must be confirmed.`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async confirmEmailUser(req, res) {
		try {
			const emailToken = req.params.emailToken;
			const payload = jwt.verify(emailToken, JWT_SECRET);
			await User.updateOne({ email: payload.email }, { $set: { emailConfirmed: true } });
			res.status(201).send({ msg: 'User email was confirmed. User created.' });
		} catch (error) {
			console.error(error);
			res.status(500).send(error);
		}
	},
	async updateUser(req, res) {
		try {
			const {password, confirmPasswor,...userToUpdate} = req.body; 
			const user = await User.findOneAndUpdate({ _id: req.params._id }, userToUpdate, { new: true });
			res.status(201).send({ msg: 'User updated in database', user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async deleteUser(req, res) {
		try {
			const user = await User.findByIdAndDelete({ _id: req.params._id });
			res.status(201).send({ msg: 'User deleted from database', user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async allUsers(req, res) {
		try {
			const users = await User.find().populate('images');
			res.status(201).send({ msg: 'All users', users });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async login(req, res) {
		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return res.status(400).send({ msg: 'Email or password are wrong.' });
			}
			const isMatch = await bcrypt.compare(req.body.password, user.password);
			if (!isMatch) {
				return res.status(400).send({ msg: 'Email or password are wrong.' });
			}
			const token = jwt.sign({ _id: user._id }, JWT_SECRET);
			user.connections.push({ token, date: new Date() });
			await user.save({ validateBeforeSave: false });
			res.send({ msg: `Welcome ${user.firstname}.`, user, token });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async findUserById(req, res) {
		try {
			const user = await User.findOne({ _id: req.params._id }).populate('images');
			res.send({ msg: `User with id: ${req.params._id} was found.`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `The user with id: ${error.value} does not exist in the database.`, error });
		}
	},
	async findUserByFirstname(req, res) {
		try {
			if (req.params.firstname.length > 20) {
				return res.status(400).send('Search to long.');
			}
			const firstname = new RegExp(req.params.firstname, 'i');
			const user = await User.find({ firstname }).populate('images');
			res.send({ msg: `The user or users contains ${req.params.firstname} in his firstname`, user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `No user found`, error });
		}
	},
	async logout(req, res) {
		try {
			const user = await User.findOne({ _id: req.user._id });
			user.connections.forEach((connection) => connection.token === req.headers.authorization && (connection.token = ''));
			await user.save({ validateBeforeSave: false });
			res.send({ msg: 'User logged out', user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: `User not logged out properly.`, error });
		}
	},
	async userInfo(req, res) {
		try {
			const user = await User.findById(req.user._id).populate('images');
			res.send({ msg: 'User info:', user });
		} catch (error) {
			console.error(error);
			res.status(500).send({ msg: 'Server error', error });
		}
	},
	async recoverPassword(req, res) {
		try {
			const recoverToken = jwt.sign({ email: req.params.email }, JWT_SECRET, {
				expiresIn: '48h',
			});
			const url = API_URL + '/users/resetPassword/' + recoverToken;
			await transporter.sendMail({
				to: req.params.email,
				subject: 'Recover password',
				html: `<h3> Recover password </h3>
	  <a href="${url}">Recover your password</a>
	  You have only 48 hours to change the password with these email.`,
			});
			res.send({ msg: 'A recover email was sended to your email' });
		} catch (error) {
			console.error({ msg: 'Server error', error });
		}
	},
	async resetPassword(req, res) {
		try {
			const recoverToken = req.params.recoverToken;
			const payload = jwt.verify(recoverToken, JWT_SECRET);
			const password = await bcrypt.hash(req.body.password, 10);
			const user = await User.findOneAndUpdate({ email: payload.email }, { password }, { new: true });
			res.send({ msg: 'Password was changed', user });
		} catch (error) {
			console.error({ msg: 'Server error', error });
		}
	},
};

module.exports = UserController;
