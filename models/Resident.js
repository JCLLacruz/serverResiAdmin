const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ResidentSchema = new mongoose.Schema(
	{
		firstname: { type: String, required: [true, 'Firstname are required'] },
		lastname: { type: String, required: [true, 'Lastname are required'] },
		email: { type: String },
		phoneNumber: { type: Number, required: [true, 'Phone number are required']},
		emergency: {
			nameOfEmergencyContact: { type: String, required: [true, 'Name of contact for emergencies are required'] },
			phoneNumber: { type: Number, required: [true, 'Phone number for emergencies are required'] },
		},
		birthday: { type: Date, required: true },
		adress: { street: String, yardnumber: String, cipcode: Number, city: String, country: String },
		image_path: String,
		moreinfo: String,
		Activities: [{activityId: { type: ObjectId, ref: 'Activity' }, activityName:{type: String}, date: {type: Date}}],
		group: {number: {type: Number}, subdivision: {type: String}},
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
