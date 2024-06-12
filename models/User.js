const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const UserSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: [true, 'Firstname are required'] },
		lastname: { type: String, required: [true, 'Lastname are required'] },
		email: { type: String, required: [true, 'Username are required'], unique: true },
		telephonnumber:{type: Number, require:[true, 'Telephonnumber are required']},
		password: { type: String, required: true },
		birthday: { type: Date, required: true },
		role: String,
		image_path: String,
		conections: [{token:{type: String}, date: {timestamps:true}}],
		CommentIds: [{type: ObjectId, ref: 'Comment'}],
	},
	{ timestamps: true }
);

UserSchema.index({username: 'text'});

UserSchema.methods.toJSON = function () {
	const user = this._doc;
	delete user.tokens;
	delete user.password;
	delete user.__v;
	return user;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;