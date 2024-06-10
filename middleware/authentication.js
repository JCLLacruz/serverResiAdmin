const User = require('../models/User.js');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { JWT_SECRET } = process.env;

const authentication = async (req, res, next) => {
	try {
		const token = req.headers.authorization;
		const payload = jwt.verify(token, JWT_SECRET);
		const user = await User.findOne({ _id: payload._id, tokens: token });
		if (!user) {
			return res.status(401).send({ msg: 'You are not autorized.' });
		}
		req.user = user;
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({ msg: 'There has been a problem with the token.', error });
	}
};

const isAdmin = async (req, res, next) => {
	try {
		const admins = ['admin', 'superadmin'];
		if (!admins.includes(req.user.role)) {
			return res.status(403).send({
				msg: 'You do not have permission',
			});
		}
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({ msg: 'There has been a problem with the token.', error });
	}
};

const isAuthor = async (req, res, next, model) => {
	try {
		const response = await User.findById(req.params._id);
		if (response.userId.toString() !== req.user._id.toString()) {
			return res.status(403).send({ msg: `That's not yours.` });
		}
		next();
	} catch (error) {
		console.error(error);
		return res.status(500).send({ msg: 'There has been a problem with the token.', error });
	}
};

module.exports = { authentication, isAdmin, isAuthor };