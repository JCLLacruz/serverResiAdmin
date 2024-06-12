const mongoose = require('mongoose');
const ObjectId = mongoose.SchemaTypes.ObjectId;

const ActivitySchema = new mongoose.Schema(
	{
		title: { type: String, required: [true, 'Title for activity are required'], unique:true},
		description: { type: String, required: [true, 'Description are required'] },
		sesions: [{type: Number}],
		image_path: String,
		UserId:{type: ObjectId, ref: 'User'},
		ResidentIds: [{residentId: { type: ObjectId, ref: 'Resident' }, firstname: {type: String}, date: {type: Date}}],
	},
	{ timestamps: true }
);

ActivitySchema.index({ title: 'text' });

ActivitySchema.methods.toJSON = function () {
	const activity = this._doc;
	delete activity.__v;
	return activity;
};

const Activity = mongoose.model('Activity', ActivitySchema);

module.exports = Activity;
