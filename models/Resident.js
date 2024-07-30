const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ResidentSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: [true, 'Firstname are required'] },
		lastname: { type: String, required: [true, 'Lastname are required'] },
		email: { type: String },
		phoneNumber: { type: String, required: [true, 'Phone number are required']},
		emergency: {
			nameOfEmergencyContact: { type: String, required: [true, 'Name of contact for emergencies are required'] },
			phoneNumber: { type: String, required: [true, 'Phone number for emergencies are required'] },
		},
		birthday: { type: Date, required: true },
		address: { street: String, yardnumber: String, zipcode: String, city: String, country: String },
		images: [{ type: ObjectId, ref: 'Image' }],
		moreinfo: String,
		sessions: [{sessionId: {type: ObjectId,ref: 'Session'}, activityId: { type: ObjectId, ref: 'Activity' }, sessionDate: {type: Date}}],
		attendance: [{attend: {type: Boolean}, date: {type: Date}}],
		group: {identificator: {type: String}, subdivision: {type: String}},
	},
	{ timestamps: true }
);

ResidentSchema.index({ firstname: 'text' });

ResidentSchema.methods.toJSON = function () {
	const resident = this._doc;
	delete resident.__v;
	return resident;
};

const Resident = mongoose.model('Resident', ResidentSchema);

module.exports = Resident;
