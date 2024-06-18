const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: [true, 'Firstname are required'] },
		lastname: { type: String, required: [true, 'Lastname are required'] },
		email: { type: String, required: [true, 'Username are required'], unique: true },
		emailConfirmed: { type: Boolean, default: false },
		telephonnumber:{type: Number, require:[true, 'Telephonnumber are required']},
		password: { type: String, required: true },
		birthday: { type: Date, required: true },
		role: { type: String, default: 'user' },
		image_path: String,
		connections: [{token:{type: String}, date: {type: Date, default: Date.now}}],
		CommentIds: [{type: ObjectId, ref: 'Comment'}],
	},
	{ timestamps: true }
);

UserSchema.methods.toJSON = function () {
	const user = this._doc;
	delete user.password;
	delete user.__v;
	return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;