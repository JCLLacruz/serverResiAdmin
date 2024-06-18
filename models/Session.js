const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const SessionSchema = new mongoose.Schema(
	{
		activity: { type: ObjectId, ref: 'Activity'},
		observations: { type: String, required: [true, 'Observations are required'] },
		residentIds:[{type: ObjectId, ref: 'User'}],
	},
	{ timestamps: true }
);

SessionSchema.methods.toJSON = function () {
	const session = this._doc;
	delete session.__v;
	return session;
};

const Session = mongoose.model('Session', SessionSchema);

module.exports = Session;
